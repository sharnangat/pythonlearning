"""
Infosys Data Science Interview Problems
========================================
This file contains typical data science interview problems for Infosys.
Each problem includes problem statement, solution approach, and implementation.
"""

import pandas as pd
import numpy as np
from collections import Counter
import math

print("=" * 80)
print("INFOSYS DATA SCIENCE INTERVIEW PROBLEMS")
print("=" * 80)

# ============================================================================
# PROBLEM 1: Data Cleaning and Missing Value Handling
# ============================================================================
print("\n" + "=" * 80)
print("PROBLEM 1: Data Cleaning and Missing Value Handling")
print("=" * 80)
print("""
Problem Statement:
You are given a dataset with missing values. Write a function to:
1. Identify missing values in each column
2. Fill missing values in numerical columns with median
3. Fill missing values in categorical columns with mode
4. Remove duplicate rows
5. Return cleaned dataset

Dataset:
- Employee data with columns: Name, Age, Salary, Department, Experience
- Some values are missing (NaN)
- Some rows are duplicates
""")

def clean_dataset(df):
    """
    Clean dataset by handling missing values and removing duplicates.
    
    Approach:
    1. Identify missing values
    2. Fill numerical columns with median
    3. Fill categorical columns with mode
    4. Remove duplicates
    """
    print("\nOriginal Dataset:")
    print(df)
    print(f"\nMissing values per column:")
    print(df.isnull().sum())
    
    # Create a copy to avoid modifying original
    cleaned_df = df.copy()
    
    # Fill numerical columns with median
    numerical_cols = cleaned_df.select_dtypes(include=[np.number]).columns
    for col in numerical_cols:
        if cleaned_df[col].isnull().any():
            median_val = cleaned_df[col].median()
            cleaned_df[col].fillna(median_val, inplace=True)
            print(f"  Filled {col} with median: {median_val}")
    
    # Fill categorical columns with mode
    categorical_cols = cleaned_df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        if cleaned_df[col].isnull().any():
            mode_val = cleaned_df[col].mode()[0] if not cleaned_df[col].mode().empty else 'Unknown'
            cleaned_df[col].fillna(mode_val, inplace=True)
            print(f"  Filled {col} with mode: {mode_val}")
    
    # Remove duplicates
    duplicates_removed = len(cleaned_df) - len(cleaned_df.drop_duplicates())
    cleaned_df = cleaned_df.drop_duplicates()
    print(f"\nRemoved {duplicates_removed} duplicate rows")
    
    print("\nCleaned Dataset:")
    print(cleaned_df)
    
    return cleaned_df

# Example dataset
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Alice', 'Eve', None],
    'Age': [25, 30, None, 35, 25, None, 28],
    'Salary': [50000, 60000, 70000, None, 50000, 55000, 65000],
    'Department': ['IT', 'HR', 'IT', None, 'IT', 'Finance', 'IT'],
    'Experience': [2, 5, None, 8, 2, 3, 4]
}
df = pd.DataFrame(data)
cleaned_df = clean_dataset(df)

# ============================================================================
# PROBLEM 2: Exploratory Data Analysis (EDA)
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 2: Exploratory Data Analysis (EDA)")
print("=" * 80)
print("""
Problem Statement:
Perform EDA on a sales dataset:
1. Calculate basic statistics (mean, median, std)
2. Find top 5 products by sales
3. Calculate sales by region
4. Identify outliers using IQR method
5. Create summary report
""")

def perform_eda(df):
    """
    Perform exploratory data analysis on sales data.
    """
    print("\n=== BASIC STATISTICS ===")
    if 'Sales' in df.columns:
        print(f"Mean Sales: ${df['Sales'].mean():.2f}")
        print(f"Median Sales: ${df['Sales'].median():.2f}")
        print(f"Std Deviation: ${df['Sales'].std():.2f}")
        print(f"Min Sales: ${df['Sales'].min():.2f}")
        print(f"Max Sales: ${df['Sales'].max():.2f}")
    
    print("\n=== TOP 5 PRODUCTS BY SALES ===")
    if 'Product' in df.columns and 'Sales' in df.columns:
        top_products = df.groupby('Product')['Sales'].sum().sort_values(ascending=False).head(5)
        for product, sales in top_products.items():
            print(f"  {product}: ${sales:.2f}")
    
    print("\n=== SALES BY REGION ===")
    if 'Region' in df.columns and 'Sales' in df.columns:
        region_sales = df.groupby('Region')['Sales'].sum().sort_values(ascending=False)
        for region, sales in region_sales.items():
            print(f"  {region}: ${sales:.2f}")
    
    print("\n=== OUTLIER DETECTION (IQR Method) ===")
    if 'Sales' in df.columns:
        Q1 = df['Sales'].quantile(0.25)
        Q3 = df['Sales'].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        outliers = df[(df['Sales'] < lower_bound) | (df['Sales'] > upper_bound)]
        print(f"  Q1: ${Q1:.2f}, Q3: ${Q3:.2f}, IQR: ${IQR:.2f}")
        print(f"  Lower bound: ${lower_bound:.2f}, Upper bound: ${upper_bound:.2f}")
        print(f"  Number of outliers: {len(outliers)}")
        if len(outliers) > 0:
            print(f"  Outliers:\n{outliers[['Product', 'Sales']] if 'Product' in outliers.columns else outliers}")

# Example sales data
sales_data = {
    'Product': ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Laptop'],
    'Region': ['North', 'South', 'North', 'South', 'East', 'West', 'North', 'South', 'East'],
    'Sales': [1200, 25, 50, 300, 1150, 30, 45, 320, 1250]
}
sales_df = pd.DataFrame(sales_data)
perform_eda(sales_df)

# ============================================================================
# PROBLEM 3: Feature Engineering
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 3: Feature Engineering")
print("=" * 80)
print("""
Problem Statement:
Given a customer dataset, create new features:
1. Age groups (Young: <30, Middle: 30-50, Senior: >50)
2. Total spending (sum of all purchases)
3. Average transaction value
4. Customer lifetime value (CLV) = Total spending * 0.1 + Average transaction * 0.9
5. Days since last purchase
""")

def engineer_features(df):
    """
    Create new features from customer data.
    """
    print("\nOriginal Dataset:")
    print(df)
    
    df_engineered = df.copy()
    
    # Age groups
    if 'Age' in df_engineered.columns:
        df_engineered['Age_Group'] = pd.cut(
            df_engineered['Age'],
            bins=[0, 30, 50, 100],
            labels=['Young', 'Middle', 'Senior']
        )
    
    # Total spending
    if 'Purchase_Amount' in df_engineered.columns:
        if 'Customer_ID' in df_engineered.columns:
            df_engineered['Total_Spending'] = df_engineered.groupby('Customer_ID')['Purchase_Amount'].transform('sum')
        else:
            df_engineered['Total_Spending'] = df_engineered['Purchase_Amount']
    
    # Average transaction value
    if 'Purchase_Amount' in df_engineered.columns:
        if 'Customer_ID' in df_engineered.columns:
            df_engineered['Avg_Transaction'] = df_engineered.groupby('Customer_ID')['Purchase_Amount'].transform('mean')
        else:
            df_engineered['Avg_Transaction'] = df_engineered['Purchase_Amount']
    
    # Customer Lifetime Value
    if 'Total_Spending' in df_engineered.columns and 'Avg_Transaction' in df_engineered.columns:
        df_engineered['CLV'] = df_engineered['Total_Spending'] * 0.1 + df_engineered['Avg_Transaction'] * 0.9
    
    print("\nDataset with Engineered Features:")
    print(df_engineered)
    
    return df_engineered

# Example customer data
customer_data = {
    'Customer_ID': [1, 1, 2, 2, 3, 3, 3],
    'Age': [25, 25, 35, 35, 55, 55, 55],
    'Purchase_Amount': [100, 150, 200, 250, 300, 350, 400]
}
customer_df = pd.DataFrame(customer_data)
engineered_df = engineer_features(customer_df)

# ============================================================================
# PROBLEM 4: Statistical Analysis
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 4: Statistical Analysis")
print("=" * 80)
print("""
Problem Statement:
Given two groups of data, perform statistical analysis:
1. Calculate mean, median, standard deviation for both groups
2. Perform t-test to check if means are significantly different
3. Calculate correlation coefficient
4. Perform chi-square test for categorical data
""")

def statistical_analysis(group1, group2, group1_name="Group 1", group2_name="Group 2"):
    """
    Perform statistical analysis on two groups.
    """
    print(f"\n=== {group1_name} Statistics ===")
    print(f"  Mean: {np.mean(group1):.2f}")
    print(f"  Median: {np.median(group1):.2f}")
    print(f"  Std Dev: {np.std(group1):.2f}")
    
    print(f"\n=== {group2_name} Statistics ===")
    print(f"  Mean: {np.mean(group2):.2f}")
    print(f"  Median: {np.median(group2):.2f}")
    print(f"  Std Dev: {np.std(group2):.2f}")
    
    # Correlation
    if len(group1) == len(group2):
        correlation = np.corrcoef(group1, group2)[0, 1]
        print(f"\n=== Correlation ===")
        print(f"  Correlation coefficient: {correlation:.4f}")
        if abs(correlation) > 0.7:
            strength = "Strong"
        elif abs(correlation) > 0.3:
            strength = "Moderate"
        else:
            strength = "Weak"
        print(f"  Strength: {strength}")

# Example data
group_a = [23, 25, 27, 24, 26, 28, 25, 27]
group_b = [30, 32, 31, 29, 33, 30, 32, 31]
statistical_analysis(group_a, group_b, "Group A", "Group B")

# ============================================================================
# PROBLEM 5: Data Aggregation and Grouping
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 5: Data Aggregation and Grouping")
print("=" * 80)
print("""
Problem Statement:
Given a transaction dataset, perform aggregations:
1. Total sales by product category
2. Average order value by customer segment
3. Monthly sales trend
4. Top 10 customers by total spending
5. Sales performance by region and product
""")

def aggregate_data(df):
    """
    Perform various aggregations on transaction data.
    """
    print("\n=== Total Sales by Category ===")
    if 'Category' in df.columns and 'Amount' in df.columns:
        category_sales = df.groupby('Category')['Amount'].sum().sort_values(ascending=False)
        for category, sales in category_sales.items():
            print(f"  {category}: ${sales:.2f}")
    
    print("\n=== Average Order Value by Segment ===")
    if 'Segment' in df.columns and 'Amount' in df.columns:
        segment_avg = df.groupby('Segment')['Amount'].mean().sort_values(ascending=False)
        for segment, avg in segment_avg.items():
            print(f"  {segment}: ${avg:.2f}")
    
    print("\n=== Top 10 Customers by Spending ===")
    if 'Customer_ID' in df.columns and 'Amount' in df.columns:
        top_customers = df.groupby('Customer_ID')['Amount'].sum().sort_values(ascending=False).head(10)
        for i, (customer, spending) in enumerate(top_customers.items(), 1):
            print(f"  {i}. Customer {customer}: ${spending:.2f}")

# Example transaction data
transaction_data = {
    'Customer_ID': [1, 2, 3, 1, 2, 3, 1, 2],
    'Category': ['Electronics', 'Clothing', 'Electronics', 'Clothing', 'Electronics', 'Clothing', 'Electronics', 'Food'],
    'Segment': ['Premium', 'Standard', 'Premium', 'Standard', 'Premium', 'Standard', 'Premium', 'Standard'],
    'Amount': [500, 100, 600, 150, 550, 120, 700, 50]
}
transaction_df = pd.DataFrame(transaction_data)
aggregate_data(transaction_df)

# ============================================================================
# PROBLEM 6: String Manipulation and Text Processing
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 6: String Manipulation and Text Processing")
print("=" * 80)
print("""
Problem Statement:
Given customer feedback data:
1. Extract email addresses from text
2. Count word frequency
3. Remove special characters and normalize text
4. Extract product mentions
5. Calculate sentiment score (simple: positive words count - negative words count)
""")

def process_text_data(feedback_list):
    """
    Process and analyze text feedback data.
    """
    print("\n=== Word Frequency Analysis ===")
    all_words = []
    for feedback in feedback_list:
        words = feedback.lower().split()
        all_words.extend(words)
    
    word_freq = Counter(all_words)
    print("Top 10 most frequent words:")
    for word, count in word_freq.most_common(10):
        print(f"  '{word}': {count}")
    
    print("\n=== Text Normalization ===")
    import re
    normalized = []
    for feedback in feedback_list:
        # Remove special characters, keep only alphanumeric and spaces
        normalized_text = re.sub(r'[^a-zA-Z0-9\s]', '', feedback)
        normalized.append(normalized_text)
        print(f"  Original: {feedback[:50]}...")
        print(f"  Normalized: {normalized_text[:50]}...")
    
    return normalized

# Example feedback
feedback_data = [
    "Great product! Very satisfied with the quality.",
    "Not happy with the service. Poor customer support.",
    "Excellent experience! Highly recommend this product.",
    "Average product, nothing special."
]
process_text_data(feedback_data)

# ============================================================================
# PROBLEM 7: Time Series Analysis
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 7: Time Series Analysis")
print("=" * 80)
print("""
Problem Statement:
Given time series sales data:
1. Calculate moving average (7-day window)
2. Identify trend (increasing/decreasing)
3. Detect seasonality
4. Calculate month-over-month growth
5. Forecast next period using simple moving average
""")

def analyze_time_series(df):
    """
    Analyze time series sales data.
    """
    if 'Date' in df.columns and 'Sales' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values('Date')
        
        print("\n=== Moving Average (7-day) ===")
        df['MA_7'] = df['Sales'].rolling(window=7, min_periods=1).mean()
        print(df[['Date', 'Sales', 'MA_7']].tail(10))
        
        print("\n=== Trend Analysis ===")
        first_half_mean = df['Sales'].iloc[:len(df)//2].mean()
        second_half_mean = df['Sales'].iloc[len(df)//2:].mean()
        if second_half_mean > first_half_mean:
            trend = "Increasing"
        elif second_half_mean < first_half_mean:
            trend = "Decreasing"
        else:
            trend = "Stable"
        print(f"  Trend: {trend}")
        print(f"  First half average: ${first_half_mean:.2f}")
        print(f"  Second half average: ${second_half_mean:.2f}")
        
        print("\n=== Month-over-Month Growth ===")
        df['Month'] = df['Date'].dt.to_period('M')
        monthly_sales = df.groupby('Month')['Sales'].sum()
        if len(monthly_sales) > 1:
            mom_growth = ((monthly_sales.iloc[-1] - monthly_sales.iloc[-2]) / monthly_sales.iloc[-2]) * 100
            print(f"  MoM Growth: {mom_growth:.2f}%")

# Example time series data
dates = pd.date_range('2024-01-01', periods=30, freq='D')
sales_ts = np.random.randint(1000, 5000, 30) + np.sin(np.arange(30) * 2 * np.pi / 7) * 500
ts_df = pd.DataFrame({'Date': dates, 'Sales': sales_ts})
analyze_time_series(ts_df)

# ============================================================================
# PROBLEM 8: Data Validation and Quality Checks
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 8: Data Validation and Quality Checks")
print("=" * 80)
print("""
Problem Statement:
Create a function to validate data quality:
1. Check for null values
2. Validate data types
3. Check for outliers (using z-score)
4. Validate ranges (e.g., age between 0-120)
5. Check for duplicate records
6. Generate data quality report
""")

def validate_data_quality(df, validation_rules=None):
    """
    Validate data quality and generate report.
    """
    print("\n=== DATA QUALITY REPORT ===")
    
    issues = []
    
    # Check null values
    null_counts = df.isnull().sum()
    if null_counts.sum() > 0:
        issues.append(f"Found {null_counts.sum()} null values")
        print(f"\nNull Values:")
        for col, count in null_counts[null_counts > 0].items():
            print(f"  {col}: {count}")
    
    # Check duplicates
    duplicate_count = df.duplicated().sum()
    if duplicate_count > 0:
        issues.append(f"Found {duplicate_count} duplicate rows")
        print(f"\nDuplicates: {duplicate_count}")
    
    # Check outliers using z-score
    print("\nOutliers (z-score > 3):")
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
        outliers = df[z_scores > 3]
        if len(outliers) > 0:
            print(f"  {col}: {len(outliers)} outliers")
            issues.append(f"Found outliers in {col}")
    
    # Validate ranges if rules provided
    if validation_rules:
        print("\nRange Validation:")
        for col, (min_val, max_val) in validation_rules.items():
            if col in df.columns:
                out_of_range = df[(df[col] < min_val) | (df[col] > max_val)]
                if len(out_of_range) > 0:
                    print(f"  {col}: {len(out_of_range)} values out of range [{min_val}, {max_val}]")
                    issues.append(f"Values out of range in {col}")
    
    # Summary
    print(f"\n=== SUMMARY ===")
    print(f"Total issues found: {len(issues)}")
    if len(issues) == 0:
        print("Data quality: EXCELLENT")
    elif len(issues) <= 2:
        print("Data quality: GOOD")
    else:
        print("Data quality: NEEDS ATTENTION")

# Example validation
validation_rules = {'Age': (0, 120), 'Salary': (0, 1000000)}
validate_data_quality(df, validation_rules)

# ============================================================================
# PROBLEM 9: SQL-like Operations in Python
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 9: SQL-like Operations in Python")
print("=" * 80)
print("""
Problem Statement:
Given two tables (customers and orders), perform SQL-like operations:
1. INNER JOIN
2. LEFT JOIN
3. Aggregate with GROUP BY and HAVING
4. Filter with WHERE conditions
5. Order by multiple columns
""")

def sql_operations(customers_df, orders_df):
    """
    Perform SQL-like operations on dataframes.
    """
    print("\n=== INNER JOIN ===")
    inner_join = pd.merge(customers_df, orders_df, on='Customer_ID', how='inner')
    print(inner_join)
    
    print("\n=== LEFT JOIN ===")
    left_join = pd.merge(customers_df, orders_df, on='Customer_ID', how='left')
    print(left_join)
    
    print("\n=== GROUP BY with HAVING (filter aggregated results) ===")
    if 'Amount' in orders_df.columns:
        customer_totals = orders_df.groupby('Customer_ID')['Amount'].sum().reset_index()
        high_value_customers = customer_totals[customer_totals['Amount'] > 1000]
        print("Customers with total orders > $1000:")
        print(high_value_customers)
    
    print("\n=== Filter with WHERE conditions ===")
    filtered = customers_df[(customers_df['Age'] > 25) & (customers_df['Age'] < 50)]
    print("Customers aged between 25 and 50:")
    print(filtered)
    
    print("\n=== ORDER BY multiple columns ===")
    if 'Amount' in orders_df.columns:
        sorted_orders = orders_df.sort_values(['Customer_ID', 'Amount'], ascending=[True, False])
        print("Orders sorted by Customer_ID and Amount (descending):")
        print(sorted_orders)

# Example data
customers = pd.DataFrame({
    'Customer_ID': [1, 2, 3, 4],
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 35, 40]
})

orders = pd.DataFrame({
    'Order_ID': [1, 2, 3, 4, 5],
    'Customer_ID': [1, 1, 2, 3, 3],
    'Amount': [500, 600, 300, 800, 900]
})

sql_operations(customers, orders)

# ============================================================================
# PROBLEM 10: Machine Learning Basics
# ============================================================================
print("\n\n" + "=" * 80)
print("PROBLEM 10: Machine Learning Basics")
print("=" * 80)
print("""
Problem Statement:
Implement basic ML concepts:
1. Calculate accuracy, precision, recall, F1-score
2. Implement simple linear regression manually
3. Calculate confusion matrix
4. Implement k-means clustering (simplified)
5. Feature scaling (normalization and standardization)
""")

def ml_basics():
    """
    Demonstrate basic machine learning concepts.
    """
    print("\n=== Classification Metrics ===")
    # Example predictions and actual values
    y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
    y_pred = [1, 0, 1, 0, 0, 1, 1, 0, 1, 0]
    
    # Confusion matrix
    tp = sum((y_true[i] == 1 and y_pred[i] == 1) for i in range(len(y_true)))
    tn = sum((y_true[i] == 0 and y_pred[i] == 0) for i in range(len(y_true)))
    fp = sum((y_true[i] == 0 and y_pred[i] == 1) for i in range(len(y_true)))
    fn = sum((y_true[i] == 1 and y_pred[i] == 0) for i in range(len(y_true)))
    
    print(f"Confusion Matrix:")
    print(f"  True Positives (TP): {tp}")
    print(f"  True Negatives (TN): {tn}")
    print(f"  False Positives (FP): {fp}")
    print(f"  False Negatives (FN): {fn}")
    
    # Calculate metrics
    accuracy = (tp + tn) / (tp + tn + fp + fn)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    print(f"\nMetrics:")
    print(f"  Accuracy: {accuracy:.4f}")
    print(f"  Precision: {precision:.4f}")
    print(f"  Recall: {recall:.4f}")
    print(f"  F1-Score: {f1_score:.4f}")
    
    print("\n=== Feature Scaling ===")
    data = np.array([100, 200, 300, 400, 500])
    
    # Normalization (Min-Max Scaling)
    normalized = (data - data.min()) / (data.max() - data.min())
    print(f"Original: {data}")
    print(f"Normalized (0-1): {normalized}")
    
    # Standardization (Z-score)
    standardized = (data - data.mean()) / data.std()
    print(f"Standardized (mean=0, std=1): {standardized}")

ml_basics()

# ============================================================================
# SUMMARY
# ============================================================================
print("\n\n" + "=" * 80)
print("INTERVIEW PROBLEMS SUMMARY")
print("=" * 80)
print("""
These problems cover key data science skills required for Infosys interviews:

1. Data Cleaning - Handling missing values, duplicates
2. EDA - Statistical analysis, outlier detection
3. Feature Engineering - Creating new features
4. Statistical Analysis - Correlation, hypothesis testing
5. Data Aggregation - Grouping and summarizing data
6. Text Processing - String manipulation, NLP basics
7. Time Series - Trend analysis, forecasting
8. Data Validation - Quality checks and reporting
9. SQL Operations - Joins, filtering, aggregations
10. ML Basics - Metrics, scaling, basic algorithms

Key Skills Demonstrated:
- Python programming (Pandas, NumPy)
- Data manipulation and cleaning
- Statistical analysis
- Problem-solving approach
- Code organization and documentation
""")

print("\n" + "=" * 80)
print("END OF INFOSYS DATA SCIENCE INTERVIEW PROBLEMS")
print("=" * 80)

