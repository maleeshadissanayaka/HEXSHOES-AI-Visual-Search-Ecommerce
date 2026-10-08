"""Validate the shared registry without loading CLIP or changing catalog data."""
import json
from pathlib import Path


def verified_mappings(registry, filenames):
    if not isinstance(registry, dict) or registry.get("schemaVersion") != 1:
        raise ValueError("Unsupported product-image registry schema.")
    products = registry.get("products")
    images = registry.get("catalogImages")
    if not isinstance(products, list) or not isinstance(images, list):
        raise ValueError("Registry products and catalogImages must be arrays.")
    product_ids = set()
    for product in products:
        if not isinstance(product, dict):
            raise ValueError("Invalid registry product.")
        product_id = product.get("productId")
        if not isinstance(product_id, str) or not product_id.strip() or product_id in product_ids:
            raise ValueError("Registry product IDs must be unique, nonempty strings.")
        for field in ("productCode", "name", "storeImage"):
            value = product.get(field)
            if value is not None and (not isinstance(value, str) or not value.strip()):
                raise ValueError("Invalid registry product metadata.")
        product_ids.add(product_id)
    seen = set()
    mapped_products = set()
    mappings = {}
    for image in images:
        if not isinstance(image, dict):
            raise ValueError("Invalid registry image.")
        filename = image.get("aiImageFilename")
        if not isinstance(filename, str) or filename not in filenames or filename in seen:
            raise ValueError("Registry filenames must be unique catalog entries.")
        seen.add(filename)
        verified = image.get("verified")
        if type(verified) is not bool:
            raise ValueError("Every registry image must explicitly declare verified.")
        product_id = image.get("productId")
        evidence = image.get("evidence")
        if not verified:
            if "productId" not in image or "evidence" not in image or product_id is not None or evidence is not None:
                raise ValueError("Unresolved images must have null productId and evidence.")
            continue
        if not isinstance(product_id, str) or product_id not in product_ids or product_id in mapped_products:
            raise ValueError("Verified images require a unique registered product ID.")
        if not isinstance(evidence, str) or not evidence.strip():
            raise ValueError("Verified mappings require documented confirmation evidence.")
        mapped_products.add(product_id)
        mappings[filename] = product_id
    if seen != set(filenames):
        raise ValueError("Every catalog image must be explicitly listed in the registry.")
    return mappings


def load_registry(path: Path, filenames):
    with path.open(encoding="utf-8") as handle:
        return verified_mappings(json.load(handle), filenames)
