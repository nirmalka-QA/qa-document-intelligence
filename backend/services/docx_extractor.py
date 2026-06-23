from docx import Document


class DOCXExtractor:

    def extract(self, file_path: str):

        document = Document(file_path)

        text = []

        for paragraph in document.paragraphs:

            text.append(paragraph.text)

        return "\n".join(text)