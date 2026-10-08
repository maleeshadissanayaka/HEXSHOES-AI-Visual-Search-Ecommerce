import io
import unittest
from pathlib import Path
from fastapi import HTTPException
from starlette.datastructures import UploadFile, Headers
import api


class UploadTests(unittest.IsolatedAsyncioTestCase):
    async def test_server_rejects_invalid_inputs_with_safe_messages(self):
        cases = [
            ("photo.exe", "image/jpeg", b"bad", 415),
            ("photo.jpg", "application/octet-stream", b"bad", 415),
            ("empty.jpg", "image/jpeg", b"", 422),
            ("corrupt.jpg", "image/jpeg", b"\xff\xd8\xff", 422),
            ("oversized.png", "image/png", b"x" * (api.MAX_UPLOAD + 1), 413),
        ]
        for filename, mime, data, status in cases:
            with self.subTest(filename=filename):
                upload = UploadFile(io.BytesIO(data), filename=filename, headers=Headers({"content-type": mime}))
                with self.assertRaises(HTTPException) as caught:
                    await api.search(upload)
                self.assertEqual(caught.exception.status_code, status)
                self.assertNotIn("Traceback", caught.exception.detail)
                self.assertTrue(upload.file.closed)

    async def test_genuine_upload_is_ranked_and_not_saved(self):
        image = (Path(__file__).parent / "test_query.jpg").read_bytes()
        upload = UploadFile(io.BytesIO(image), filename="test_query.jpg", headers=Headers({"content-type": "image/jpeg"}))
        result = await api.search(upload)
        self.assertTrue(upload.file.closed)
        self.assertEqual(result["metric"], "cosine_similarity")
        self.assertEqual(len(result["matches"]), 5)
        self.assertTrue(all(match["productId"] is None for match in result["matches"]))
        scores = [match["score"] for match in result["matches"]]
        self.assertEqual(scores, sorted(scores, reverse=True))


if __name__ == "__main__":
    unittest.main()
