import os
import unittest
from pathlib import Path
from unittest.mock import patch
import start


class DeploymentStartTests(unittest.TestCase):
    def test_platform_port_bind_and_absolute_app_directory(self):
        with patch.dict(os.environ, {"PORT": "8123"}), patch("start.uvicorn.run") as run:
            start.main()
            run.assert_called_once_with("api:app", host="0.0.0.0", port=8123,
                                        workers=1, app_dir=str(Path(start.__file__).resolve().parent))

    def test_invalid_platform_ports_fail_before_startup(self):
        for value in ["invalid", "0", "65536"]:
            with self.subTest(value=value), patch.dict(os.environ, {"PORT": value}), patch("start.uvicorn.run") as run:
                with self.assertRaisesRegex(SystemExit, "PORT must be an integer"):
                    start.main()
                run.assert_not_called()
