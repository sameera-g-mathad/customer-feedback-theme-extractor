# Customer Feedback Theme Extractor

This project is designed to analyze customer feedback and extract common themes and sentiments. It utilizes natural language processing (NLP) techniques to identify key topics and trends in customer reviews, surveys, and other feedback forms. This is the backend code for the application, which handles data processing, theme extraction, and sentiment analysis. The backend is built using Python and leverages libraries such as fastapi, sentence-transformer, scikit-learn to perform advanced text analysis and machine learning tasks.

## Installation:

1. To install the required and optional dependencies, run the following command:

   ```bash
   pip install .
   pip install '.[dev]'
   ```

2. To run the backend server, use the command:

   ```bash
   uvicorn api.app:app --reload --port 8000
   ```
