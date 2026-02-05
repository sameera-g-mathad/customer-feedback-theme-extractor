import json
from pathlib import Path
from typing import List, Dict, Any
import logging
import pandas as pd
import pdfplumber
from docx import Document

logger = logging.getLogger(__name__)


class FileParser:
    """
    Handles parsing of multiple file formats into unified feedback schema
    """

    @staticmethod
    def parse_csv(file_path: Path) -> pd.DataFrame:
        """Parse CSV files using pandas"""
        try:
            df = pd.read_csv(file_path)
            return df
        except Exception as e:
            logger.error("Error parsing CSV %s: %s", file_path, e)
            raise

    @staticmethod
    def parse_excel(file_path: Path) -> pd.DataFrame:
        """Parse Excel files using pandas"""
        try:
            df = pd.read_excel(file_path)
            return df
        except Exception as e:
            logger.error("Error parsing Excel %s: %s", file_path, e)
            raise

    @staticmethod
    def parse_pdf(file_path: Path) -> List[str]:
        """Extract text from PDF files"""
        try:
            texts = []
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        texts.append(text.strip())
            return texts
        except Exception as e:
            logger.error("Error parsing PDF %s: %s", file_path, e)
            raise

    @staticmethod
    def parse_docx(file_path: Path) -> List[str]:
        """Extract paragraphs from DOCX files"""
        try:
            doc = Document(str(file_path))
            paragraphs = [
                para.text.strip() for para in doc.paragraphs if para.text.strip()
            ]
            return paragraphs
        except Exception as e:
            logger.error("Error parsing DOCX %s: %s", file_path, e)
            raise

    @staticmethod
    def parse_json(file_path: Path) -> List[Dict]:
        """Parse JSON files with recursive flattening"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Handle both list and dict formats
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                return [data]
            else:
                return [{"content": str(data)}]
        except Exception as e:
            logger.error("Error parsing JSON %s: %s", file_path, e)
            raise

    @staticmethod
    def parse_txt(file_path: Path) -> List[str]:
        """Parse plain text files"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            # Split by double newlines to get paragraphs
            paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
            return paragraphs if paragraphs else [content.strip()]
        except Exception as e:

            logger.error("Error parsing TXT %s: %s", file_path, e)
            raise

    def parse_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """
        Parse any supported file type and return unified feedback entries

        Returns:
            List of dicts with keys: feedback_id, source_file, raw_text
        """
        suffix = file_path.suffix.lower()
        feedback_entries = []

        try:
            if suffix == ".csv":
                df = self.parse_csv(file_path)
                # Assume feedback is in a column named 'feedback', 'text', 'comment', or first text column
                text_col = self._find_text_column(df)
                for idx, row in df.iterrows():
                    feedback_entries.append(
                        {
                            "feedback_id": f"{file_path.stem}_{idx}",
                            "source_file": file_path.name,
                            "raw_text": str(row[text_col]),
                        }
                    )

            elif suffix == ".xlsx":
                df = self.parse_excel(file_path)
                text_col = self._find_text_column(df)
                for idx, row in df.iterrows():
                    feedback_entries.append(
                        {
                            "feedback_id": f"{file_path.stem}_{idx}",
                            "source_file": file_path.name,
                            "raw_text": str(row[text_col]),
                        }
                    )

            elif suffix == ".pdf":
                texts = self.parse_pdf(file_path)
                for idx, text in enumerate(texts):
                    feedback_entries.append(
                        {
                            "feedback_id": f"{file_path.stem}_{idx}",
                            "source_file": file_path.name,
                            "raw_text": text,
                        }
                    )

            elif suffix == ".docx":
                paragraphs = self.parse_docx(file_path)
                for idx, para in enumerate(paragraphs):
                    feedback_entries.append(
                        {
                            "feedback_id": f"{file_path.stem}_{idx}",
                            "source_file": file_path.name,
                            "raw_text": para,
                        }
                    )

            elif suffix == ".json":
                items = self.parse_json(file_path)
                for idx, item in enumerate(items):
                    # Try to find text field
                    text = self._extract_text_from_json(item)
                    feedback_entries.append(
                        {
                            "feedback_id": f"{file_path.stem}_{idx}",
                            "source_file": file_path.name,
                            "raw_text": text,
                        }
                    )

            elif suffix == ".txt" or suffix == ".md":
                paragraphs = self.parse_txt(file_path)
                for idx, para in enumerate(paragraphs):
                    feedback_entries.append(
                        {
                            "feedback_id": f"{file_path.stem}_{idx}",
                            "source_file": file_path.name,
                            "raw_text": para,
                        }
                    )

            else:
                raise ValueError(f"Unsupported file type: {suffix}")

            logger.info(
                "Parsed %s entries from %s", len(feedback_entries), file_path.name
            )
            return feedback_entries

        except Exception as e:
            logger.error("Error parsing file %s: %s", file_path, e)
            raise

    @staticmethod
    def _find_text_column(df: pd.DataFrame) -> str:
        """Find the most likely text column in a dataframe"""
        # Common column names for feedback
        candidates = [
            "feedback",
            "text",
            "comment",
            "review",
            "message",
            "content",
            "description",
        ]

        for col in candidates:
            if col in df.columns.str.lower():
                return df.columns[df.columns.str.lower() == col][0]

        # Default to first string column
        for col in df.columns:
            if df[col].dtype == "object":
                return col

        # Last resort: first column
        return df.columns[0]

    @staticmethod
    def _extract_text_from_json(item: Dict) -> str:
        """Extract text content from JSON object"""
        # Try common field names
        candidates = [
            "feedback",
            "text",
            "comment",
            "review",
            "message",
            "content",
            "description",
        ]

        for key in candidates:
            if key in item:
                return str(item[key])

        # Return entire dict as string
        return json.dumps(item)


def parse_all_files(upload_dir: Path) -> List[Dict[str, Any]]:
    """
    Parse all files in the upload directory

    Returns:
        List of all feedback entries from all files
    """
    parser = FileParser()
    all_feedback = []

    for file_path in upload_dir.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in [
            ".csv",
            ".xlsx",
            ".pdf",
            ".docx",
            ".txt",
            ".json",
            ".md",
        ]:
            try:
                entries = parser.parse_file(file_path)
                all_feedback.extend(entries)
            except Exception as e:
                logger.error("Failed to parse %s: %s", file_path.name, e)

    logger.info("Total feedback entries: %s", {len(all_feedback)})
    return all_feedback
