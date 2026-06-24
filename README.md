# QA Document Intelligence Platform 🤖📊

An AI-powered, centralized workspace designed for Quality Assurance (QA) Engineers and Business Analysts. This platform automates the extraction of business requirements, identifies project risks, generates comprehensive test cases, and maps Requirement Traceability Matrices (RTM) from raw business documents.

## ✨ Key Features

* **Intelligent Document Parsing:** Upload PRDs, FRDs, or Architecture documents. Built-in support for multiple formats: `PDF`, `DOCX`, `XLSX`, and `PPTX`.
* **Automated Intelligence Extraction:** Automatically extracts core business requirements and identifies potential gaps or risks in the documentation.
* **Test Case Generation:** Converts parsed requirements into detailed, actionable functional and non-functional test scenarios with assigned priorities.
* **Traceability Matrix (RTM):** Automatically maps generated test cases back to original requirements to ensure 100% test coverage.
* **Export Center:** Download your artifacts seamlessly. Export Test Cases and RTMs to Excel (`.xlsx`) or generate an Executive Summary Report in Markdown.
* **Premium UI/UX:** A minimal, highly responsive interface powered by Mantine UI, featuring seamless Light/Dark mode transitions and interactive data visualizations.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Framework:** React 19 + Vite
* **Language:** TypeScript
* **State Management:** Zustand (with local storage persistence)
* **UI Library:** Mantine UI (v9) & Tabler Icons
* **Routing:** React Router DOM (v7)

### Backend (Server)
* **Framework:** FastAPI (Python)
* **Server:** Uvicorn
* **Data Validation:** Pydantic
* **Document Processing:** `pymupdf`, `python-docx`, `openpyxl`, `python-pptx`, `pandas`
* **Database:** SQLite (Custom Database Service)

---

## 🚀 Getting Started (Installation & Setup)

To run the platform locally, you will need to set up both the Python backend and the Node.js frontend.

### Prerequisites
* **Node.js** (v18+ recommended)
* **Python** (v3.10+ recommended)

### 1. Backend Setup (FastAPI)
Open your terminal and navigate to the root directory of the project.

```bash
# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3. Install backend dependencies
pip install -r backend/requirements.txt

# 4. Start the FastAPI server
uvicorn backend.app:app --reload --port 8000
```
### 2.Frontend Setup (React + Vite)
```bash

# 1. Navigate to the frontend folder
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Start the Vite development server
npm run dev

```