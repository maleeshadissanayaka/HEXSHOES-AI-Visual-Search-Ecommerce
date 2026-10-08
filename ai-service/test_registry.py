import copy
import json
import unittest
from pathlib import Path
from unittest.mock import patch
from registry import verified_mappings, load_registry

BASE = Path(__file__).resolve().parent


def fixture():
    # Synthetic test identities only; never production assignments.
    return {"schemaVersion": 1,
            "products": [{"productId": "fixture-product", "productCode": None, "storeImage": None}],
            "catalogImages": [
                {"aiImageFilename": "fixture.jpg", "productId": "fixture-product", "verified": True, "evidence": "Synthetic unit-test fixture"},
                {"aiImageFilename": "unmapped.jpg", "productId": None, "verified": False, "evidence": None}]}


class RegistryTests(unittest.TestCase):
    def test_production_registry_is_explicitly_unmapped(self):
        catalog = json.loads((BASE / "catalog_embeddings.json").read_text())
        self.assertEqual(load_registry(BASE / "product_mapping.json", {x["filename"] for x in catalog}), {})

    def test_verified_fixture_and_unmapped_entry(self):
        self.assertEqual(verified_mappings(fixture(), {"fixture.jpg", "unmapped.jpg"}), {"fixture.jpg": "fixture-product"})

    def test_rejects_untrusted_assignments(self):
        mutations = [
            lambda r: r["catalogImages"][0].update(evidence=None),
            lambda r: r["catalogImages"][0].update(productId="unknown"),
            lambda r: r["catalogImages"][0].update(verified=False),
            lambda r: r["catalogImages"][0].update(aiImageFilename="unknown.jpg"),
            lambda r: r["catalogImages"].pop(),
            lambda r: r["catalogImages"].append(copy.deepcopy(r["catalogImages"][0])),
            lambda r: r["catalogImages"][1].update(productId="fixture-product", verified=True, evidence="Synthetic fixture"),
        ]
        for mutate in mutations:
            with self.subTest(mutation=mutate):
                registry = fixture()
                mutate(registry)
                with self.assertRaises(ValueError):
                    verified_mappings(registry, {"fixture.jpg", "unmapped.jpg"})

    def test_real_clip_rank_with_isolated_mapping_fixture(self):
        import api
        image = (BASE / "test_query.jpg").read_bytes()
        baseline = api.rank(image)
        self.assertEqual(len(baseline["matches"]), 5)
        self.assertTrue(all(x["productId"] is None for x in baseline["matches"]))
        filename = baseline["matches"][0]["filename"]
        # Patch only this test process, not the registry or running API.
        with patch.object(api, "product_mapping", {filename: "fixture-product"}):
            mapped = api.rank(image)
        self.assertEqual(mapped["matches"][0]["productId"], "fixture-product")
        self.assertTrue(all(x["productId"] is None for x in mapped["matches"][1:]))
        self.assertEqual([x["score"] for x in baseline["matches"]], [x["score"] for x in mapped["matches"]])
        self.assertEqual(mapped["metric"], "cosine_similarity")


if __name__ == "__main__":
    unittest.main()
