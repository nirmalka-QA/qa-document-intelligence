import fitz


class PDFExtractor:

    def extract(self, file_path: str):

        text = ""

        document = fitz.open(file_path)

        for page in document:

            text += page.get_text()

        document.close()

        return text