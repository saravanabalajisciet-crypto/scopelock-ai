\# ScopeLock AI



\*\*AI-powered agreement and invoice validation with PayPal payment protection.\*\*



ScopeLock AI helps businesses verify an invoice against its agreement before proceeding with payment. It analyzes uploaded documents, identifies discrepancies, and presents an evidence-backed validation result.



\## The problem



Businesses can lose money when invoices contain incorrect amounts, currency differences, or details that do not match the original agreement. Manual verification can be time-consuming and inconsistent.



\## The solution



ScopeLock AI provides a document validation workflow:



1\. Upload an agreement and its corresponding invoice.

2\. Analyze the documents using AI-assisted extraction and validation.

3\. Review the result:

&#x20;  - \*\*PASS\*\* — validation passed.

&#x20;  - \*\*REVIEW\*\* — discrepancies or uncertainties need attention.

&#x20;  - \*\*BLOCK\*\* — critical discrepancies prevent payment authorization.

4\. Proceed to PayPal Sandbox payment authorization only when validation permits it.



\## Key capabilities



\- Agreement and invoice document uploads.

\- AI-assisted document analysis.

\- Amount, currency, and milestone validation.

\- Evidence-backed validation results.

\- PASS / REVIEW / BLOCK decisions.

\- PayPal Sandbox payment workflow with payment safeguards.



\## Technology stack



\*\*Frontend\*\*

\- Next.js

\- React

\- TypeScript

\- Tailwind CSS

\- Lucide React

\- Framer Motion



\*\*Backend\*\*

\- Python

\- FastAPI

\- AI-powered document analysis

\- PayPal REST API (Sandbox)



\## Project structure



```text

scopelock-ai/

├── main.py

├── ai\_service.py

├── documents.py

├── paypal\_client.py

├── requirements.txt

├── test\_ai\_service.py

├── test\_documents.py

└── frontend/

&#x20;   ├── src/

&#x20;   ├── package.json

&#x20;   └── ...

```



\## Run locally



\### Prerequisites



\- Python 3.10+

\- Node.js and npm

\- PayPal Sandbox credentials

\- Gemini API key



\### 1. Clone the repository



```bash

git clone https://github.com/saravanabalajisciet-crypto/scopelock-ai.git

cd scopelock-ai

```



\### 2. Configure backend environment



Create a `.env` file in the project root:



```env

PAYPAL\_CLIENT\_ID=your\_paypal\_client\_id

PAYPAL\_CLIENT\_SECRET=your\_paypal\_client\_secret

PAYPAL\_BASE\_URL=https://api-m.sandbox.paypal.com

GEMINI\_API\_KEY=your\_gemini\_api\_key

```



Never commit real credentials or environment files.



\### 3. Install backend dependencies



```powershell

python -m venv .venv

.\\.venv\\Scripts\\Activate.ps1

pip install -r requirements.txt

```



\### 4. Start the backend



```powershell

python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

```



Backend health endpoint:



```text

http://127.0.0.1:8000/health

```



\### 5. Configure and start the frontend



Open another terminal:



```powershell

cd frontend

npm install

```



Create `frontend/.env.local`:



```env

NEXT\_PUBLIC\_API\_BASE\_URL=http://127.0.0.1:8000

```



Start the frontend:



```powershell

npm run dev

```



Open:



```text

http://localhost:3000

```



\## Run tests



From the project root:



```powershell

.\\.venv\\Scripts\\Activate.ps1

python -m pytest -q

```



For frontend checks:



```powershell

cd frontend

npm run lint

npm run build

```



\## Payment safety



ScopeLock AI uses PayPal Sandbox for its demonstration payment workflow. Payment authorization must remain protected by backend-side validation; a frontend decision alone must never be treated as payment approval.



Use Sandbox credentials for testing. Do not use production payment credentials in a public demo environment.



\## Current project status



The local backend test suite, frontend lint, and production build have passed. Matching and mismatch document scenarios have been tested locally.



This project is under active development.



\## License



This project is licensed under the MIT License. See \[LICENSE](LICENSE).
