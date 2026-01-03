#!/usr/bin/env python3
"""
Advanced TEE and LAA Statistical Analysis
- Visualizations (charts/graphs)
- Logistic Regression Analysis
- Publication-Ready Tables
- Odds Ratios with Confidence Intervals
"""

import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.api import Logit
import statsmodels.api as sm
from sklearn.metrics import roc_curve, auc, confusion_matrix, classification_report
from tabulate import tabulate
import warnings
warnings.filterwarnings('ignore')

# Set style for publication-quality figures
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("Set2")

def load_and_clean_data(filepath):
    """Load and prepare the dataset"""
    df = pd.read_excel(filepath, sheet_name=0)
    df = df.iloc[1:].reset_index(drop=True)
    
    # Convert to numeric
    binary_cols = ['Sex', 'LAA clot', 'SEC', 'HTN', 'CHF', 'CVA/TIA', 'DM', 
                   'Vascular Dz', 'Age ≥75', 'Age ≥65', 'CVA', 'TIA']
    for col in binary_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    numeric_cols = ['Age', 'CHADS2', 'CHADS2-VASC', 'Hgb', ' Cr']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    return df

def create_visualizations(df, output_dir='./tee_analysis_output'):
    """Create comprehensive visualizations"""
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n" + "="*80)
    print("📊 CREATING VISUALIZATIONS")
    print("="*80)
    
    # Figure 1: LAA Clot Prevalence
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle('TEE and LAA Clot Analysis - Overview', fontsize=16, fontweight='bold')
    
    # 1. Clot prevalence pie chart
    clot_counts = df['LAA clot'].value_counts()
    axes[0, 0].pie([clot_counts.get(0, 0), clot_counts.get(1, 0)], 
                   labels=['No Clot', 'LAA Clot'], 
                   autopct='%1.1f%%',
                   colors=['#66c2a5', '#fc8d62'],
                   explode=(0, 0.1))
    axes[0, 0].set_title('LAA Clot Prevalence\n(n=521)', fontweight='bold')
    
    # 2. Age distribution by clot status
    clot_pos = df[df['LAA clot'] == 1]['Age'].dropna()
    clot_neg = df[df['LAA clot'] == 0]['Age'].dropna()
    axes[0, 1].hist([clot_neg, clot_pos], bins=15, label=['No Clot', 'LAA Clot'], 
                    color=['#66c2a5', '#fc8d62'], alpha=0.7)
    axes[0, 1].set_xlabel('Age (years)', fontweight='bold')
    axes[0, 1].set_ylabel('Frequency', fontweight='bold')
    axes[0, 1].set_title('Age Distribution by Clot Status', fontweight='bold')
    axes[0, 1].legend()
    axes[0, 1].grid(True, alpha=0.3)
    
    # 3. CHADS2 scores comparison
    chads2_pos = df[df['LAA clot'] == 1]['CHADS2'].dropna()
    chads2_neg = df[df['LAA clot'] == 0]['CHADS2'].dropna()
    bp_data = [chads2_neg, chads2_pos]
    bp = axes[1, 0].boxplot(bp_data, labels=['No Clot', 'LAA Clot'],
                            patch_artist=True, widths=0.6)
    for patch, color in zip(bp['boxes'], ['#66c2a5', '#fc8d62']):
        patch.set_facecolor(color)
    axes[1, 0].set_ylabel('CHADS2 Score', fontweight='bold')
    axes[1, 0].set_title('CHADS2 Scores by Clot Status', fontweight='bold')
    axes[1, 0].grid(True, alpha=0.3, axis='y')
    
    # 4. Comorbidities comparison
    comorbidities = ['HTN', 'CHF', 'CVA/TIA', 'DM', 'Vascular Dz', 'SEC']
    clot_pos_pct = []
    clot_neg_pct = []
    labels = []
    
    for comorb in comorbidities:
        if comorb in df.columns:
            pos_rate = (df[df['LAA clot'] == 1][comorb] == 1).sum() / (df[df['LAA clot'] == 1][comorb].notna().sum()) * 100
            neg_rate = (df[df['LAA clot'] == 0][comorb] == 1).sum() / (df[df['LAA clot'] == 0][comorb].notna().sum()) * 100
            clot_pos_pct.append(pos_rate)
            clot_neg_pct.append(neg_rate)
            labels.append(comorb)
    
    x = np.arange(len(labels))
    width = 0.35
    axes[1, 1].bar(x - width/2, clot_neg_pct, width, label='No Clot', color='#66c2a5', alpha=0.8)
    axes[1, 1].bar(x + width/2, clot_pos_pct, width, label='LAA Clot', color='#fc8d62', alpha=0.8)
    axes[1, 1].set_ylabel('Prevalence (%)', fontweight='bold')
    axes[1, 1].set_title('Comorbidities by Clot Status', fontweight='bold')
    axes[1, 1].set_xticks(x)
    axes[1, 1].set_xticklabels(labels, rotation=45, ha='right')
    axes[1, 1].legend()
    axes[1, 1].grid(True, alpha=0.3, axis='y')
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/figure1_overview.png', dpi=300, bbox_inches='tight')
    print(f"✅ Figure 1 saved: {output_dir}/figure1_overview.png")
    plt.close()
    
    # Figure 2: CHA2DS2-VASc Score Distribution
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    fig.suptitle('Stroke Risk Scores Analysis', fontsize=16, fontweight='bold')
    
    # CHADS2-VASc comparison
    chadsvasc_pos = df[df['LAA clot'] == 1]['CHADS2-VASC'].dropna()
    chadsvasc_neg = df[df['LAA clot'] == 0]['CHADS2-VASC'].dropna()
    
    axes[0].hist([chadsvasc_neg, chadsvasc_pos], bins=range(0, 10), 
                 label=['No Clot', 'LAA Clot'], color=['#66c2a5', '#fc8d62'], 
                 alpha=0.7, align='left')
    axes[0].set_xlabel('CHA2DS2-VASc Score', fontweight='bold')
    axes[0].set_ylabel('Frequency', fontweight='bold')
    axes[0].set_title('CHA2DS2-VASc Score Distribution', fontweight='bold')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3, axis='y')
    
    # Violin plot
    plot_data = pd.DataFrame({
        'CHA2DS2-VASc': pd.concat([chadsvasc_neg, chadsvasc_pos]),
        'Group': ['No Clot']*len(chadsvasc_neg) + ['LAA Clot']*len(chadsvasc_pos)
    })
    sns.violinplot(data=plot_data, x='Group', y='CHA2DS2-VASc', ax=axes[1], 
                   palette={'No Clot': '#66c2a5', 'LAA Clot': '#fc8d62'})
    axes[1].set_ylabel('CHA2DS2-VASc Score', fontweight='bold')
    axes[1].set_xlabel('')
    axes[1].set_title('CHA2DS2-VASc Score by Clot Status (Violin Plot)', fontweight='bold')
    axes[1].grid(True, alpha=0.3, axis='y')
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/figure2_stroke_risk.png', dpi=300, bbox_inches='tight')
    print(f"✅ Figure 2 saved: {output_dir}/figure2_stroke_risk.png")
    plt.close()

def calculate_odds_ratios(df):
    """Calculate odds ratios with confidence intervals"""
    print("\n" + "="*80)
    print("📊 ODDS RATIOS AND CONFIDENCE INTERVALS")
    print("="*80)
    
    results = []
    
    # Variables to analyze
    variables = {
        'Age ≥75': 'Age ≥75 years',
        'Sex': 'Male Sex',
        'HTN': 'Hypertension',
        'CHF': 'Congestive Heart Failure',
        'CVA/TIA': 'Prior CVA/TIA',
        'DM': 'Diabetes Mellitus',
        'Vascular Dz': 'Vascular Disease',
        'SEC': 'Spontaneous Echo Contrast'
    }
    
    for var, label in variables.items():
        if var not in df.columns:
            continue
            
        # Create contingency table
        clot_pos_exp = ((df['LAA clot'] == 1) & (df[var] == 1)).sum()
        clot_pos_noexp = ((df['LAA clot'] == 1) & (df[var] == 0)).sum()
        clot_neg_exp = ((df['LAA clot'] == 0) & (df[var] == 1)).sum()
        clot_neg_noexp = ((df['LAA clot'] == 0) & (df[var] == 0)).sum()
        
        # Calculate OR and 95% CI
        if clot_pos_noexp > 0 and clot_neg_exp > 0:
            or_value = (clot_pos_exp * clot_neg_noexp) / (clot_pos_noexp * clot_neg_exp)
            
            # Standard error and CI
            se_log_or = np.sqrt(1/clot_pos_exp + 1/clot_pos_noexp + 1/clot_neg_exp + 1/clot_neg_noexp)
            ci_lower = np.exp(np.log(or_value) - 1.96 * se_log_or)
            ci_upper = np.exp(np.log(or_value) + 1.96 * se_log_or)
            
            # Chi-square test
            contingency = [[clot_pos_exp, clot_pos_noexp],
                          [clot_neg_exp, clot_neg_noexp]]
            chi2, p_value, _, _ = stats.chi2_contingency(contingency)
            
            results.append({
                'Variable': label,
                'OR': or_value,
                'CI_Lower': ci_lower,
                'CI_Upper': ci_upper,
                'P_value': p_value,
                'Clot_Pos_n': clot_pos_exp + clot_pos_noexp,
                'Clot_Pos_pct': clot_pos_exp / (clot_pos_exp + clot_pos_noexp) * 100,
                'Clot_Neg_n': clot_neg_exp + clot_neg_noexp,
                'Clot_Neg_pct': clot_neg_exp / (clot_neg_exp + clot_neg_noexp) * 100
            })
    
    # Create table
    or_df = pd.DataFrame(results)
    
    print("\n📋 UNIVARIATE ODDS RATIOS")
    print("-" * 80)
    for _, row in or_df.iterrows():
        sig = '***' if row['P_value'] < 0.001 else '**' if row['P_value'] < 0.01 else '*' if row['P_value'] < 0.05 else 'ns'
        print(f"\n{row['Variable']}:")
        print(f"   LAA Clot +: {row['Clot_Pos_pct']:.1f}% (n={int(row['Clot_Pos_n'])})")
        print(f"   LAA Clot -: {row['Clot_Neg_pct']:.1f}% (n={int(row['Clot_Neg_n'])})")
        print(f"   OR: {row['OR']:.2f} (95% CI: {row['CI_Lower']:.2f}-{row['CI_Upper']:.2f})")
        print(f"   p-value: {row['P_value']:.4f} {sig}")
    
    return or_df

def logistic_regression_analysis(df, output_dir='./tee_analysis_output'):
    """Perform multivariable logistic regression"""
    print("\n" + "="*80)
    print("🔬 MULTIVARIABLE LOGISTIC REGRESSION ANALYSIS")
    print("="*80)
    
    # Prepare data
    analysis_df = df[['LAA clot', 'Age', 'Sex', 'HTN', 'CHF', 'CVA/TIA', 
                      'DM', 'Vascular Dz', 'SEC']].copy()
    analysis_df = analysis_df.dropna()
    
    # Define variables
    X = analysis_df[['Age', 'Sex', 'HTN', 'CHF', 'CVA/TIA', 'DM', 'Vascular Dz', 'SEC']]
    y = analysis_df['LAA clot']
    
    # Add constant
    X_const = sm.add_constant(X)
    
    # Fit model
    model = Logit(y, X_const)
    result = model.fit(disp=0)
    
    print("\n📊 MODEL SUMMARY:")
    print(result.summary())
    
    # Extract coefficients and odds ratios
    coef_df = pd.DataFrame({
        'Variable': ['Intercept'] + list(X.columns),
        'Coefficient': result.params.values,
        'Std_Error': result.bse.values,
        'OR': np.exp(result.params.values),
        'CI_Lower': np.exp(result.conf_int()[0].values),
        'CI_Upper': np.exp(result.conf_int()[1].values),
        'P_value': result.pvalues.values
    })
    
    print("\n📋 ADJUSTED ODDS RATIOS:")
    print("-" * 80)
    for _, row in coef_df.iloc[1:].iterrows():
        sig = '***' if row['P_value'] < 0.001 else '**' if row['P_value'] < 0.01 else '*' if row['P_value'] < 0.05 else 'ns'
        print(f"{row['Variable']:25s} OR: {row['OR']:6.2f} (95% CI: {row['CI_Lower']:5.2f}-{row['CI_Upper']:5.2f})  p = {row['P_value']:.4f} {sig}")
    
    # Model performance
    print(f"\n📈 MODEL PERFORMANCE:")
    print(f"   Log-Likelihood: {result.llf:.2f}")
    print(f"   AIC: {result.aic:.2f}")
    print(f"   BIC: {result.bic:.2f}")
    print(f"   Pseudo R²: {result.prsquared:.3f}")
    
    # Predictions for ROC curve
    y_pred_proba = result.predict(X_const)
    fpr, tpr, _ = roc_curve(y, y_pred_proba)
    roc_auc = auc(fpr, tpr)
    
    # Plot ROC curve
    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color='#fc8d62', lw=2, 
             label=f'ROC curve (AUC = {roc_auc:.3f})')
    plt.plot([0, 1], [0, 1], color='gray', lw=1, linestyle='--', label='Chance')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate (1 - Specificity)', fontweight='bold')
    plt.ylabel('True Positive Rate (Sensitivity)', fontweight='bold')
    plt.title('ROC Curve - Logistic Regression Model', fontweight='bold', fontsize=14)
    plt.legend(loc="lower right")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(f'{output_dir}/figure3_roc_curve.png', dpi=300, bbox_inches='tight')
    print(f"\n✅ ROC Curve saved: {output_dir}/figure3_roc_curve.png")
    plt.close()
    
    return coef_df, result

def generate_publication_table(df, or_df, lr_coef_df, output_dir='./tee_analysis_output'):
    """Generate publication-ready tables"""
    print("\n" + "="*80)
    print("📋 GENERATING PUBLICATION-READY TABLES")
    print("="*80)
    
    # Table 1: Baseline Characteristics
    print("\n📊 TABLE 1: Baseline Characteristics and Univariate Analysis")
    print("-" * 100)
    
    table1_data = []
    
    # Header
    headers = ['Characteristic', 'LAA Clot (+)\nn=85', 'LAA Clot (-)\nn=436', 
               'OR (95% CI)', 'P-value']
    
    # Age
    age_pos = df[df['LAA clot'] == 1]['Age'].dropna()
    age_neg = df[df['LAA clot'] == 0]['Age'].dropna()
    _, p_age = stats.ttest_ind(age_pos, age_neg)
    table1_data.append([
        'Age, mean ± SD (years)',
        f'{age_pos.mean():.1f} ± {age_pos.std():.1f}',
        f'{age_neg.mean():.1f} ± {age_neg.std():.1f}',
        '—',
        f'{p_age:.3f}'
    ])
    
    # Sex
    sex_pos = ((df['LAA clot'] == 1) & (df['Sex'] == 1)).sum()
    sex_pos_total = (df['LAA clot'] == 1).sum()
    sex_neg = ((df['LAA clot'] == 0) & (df['Sex'] == 1)).sum()
    sex_neg_total = (df['LAA clot'] == 0).sum()
    
    sex_or = or_df[or_df['Variable'] == 'Male Sex'].iloc[0]
    table1_data.append([
        'Male sex, n (%)',
        f'{sex_pos} ({sex_pos/sex_pos_total*100:.1f}%)',
        f'{sex_neg} ({sex_neg/sex_neg_total*100:.1f}%)',
        f'{sex_or["OR"]:.2f} ({sex_or["CI_Lower"]:.2f}–{sex_or["CI_Upper"]:.2f})',
        f'{sex_or["P_value"]:.3f}'
    ])
    
    # Comorbidities
    comorbidities_map = {
        'Hypertension': 'HTN',
        'Congestive Heart Failure': 'CHF',
        'Prior CVA/TIA': 'CVA/TIA',
        'Diabetes Mellitus': 'DM',
        'Vascular Disease': 'Vascular Dz',
        'Spontaneous Echo Contrast': 'SEC'
    }
    
    for label, col in comorbidities_map.items():
        if col in df.columns:
            pos_count = ((df['LAA clot'] == 1) & (df[col] == 1)).sum()
            pos_total = (df['LAA clot'] == 1).sum()
            neg_count = ((df['LAA clot'] == 0) & (df[col] == 1)).sum()
            neg_total = (df['LAA clot'] == 0).sum()
            
            or_row = or_df[or_df['Variable'] == label]
            if len(or_row) > 0:
                or_row = or_row.iloc[0]
                table1_data.append([
                    f'{label}, n (%)',
                    f'{pos_count} ({pos_count/pos_total*100:.1f}%)',
                    f'{neg_count} ({neg_count/neg_total*100:.1f}%)',
                    f'{or_row["OR"]:.2f} ({or_row["CI_Lower"]:.2f}–{or_row["CI_Upper"]:.2f})',
                    f'{or_row["P_value"]:.3f}'
                ])
    
    # CHADS2 scores
    chads2_pos = df[df['LAA clot'] == 1]['CHADS2'].dropna()
    chads2_neg = df[df['LAA clot'] == 0]['CHADS2'].dropna()
    _, p_chads2 = stats.mannwhitneyu(chads2_pos, chads2_neg)
    table1_data.append([
        'CHADS2, median (IQR)',
        f'{chads2_pos.median():.0f} ({chads2_pos.quantile(0.25):.0f}–{chads2_pos.quantile(0.75):.0f})',
        f'{chads2_neg.median():.0f} ({chads2_neg.quantile(0.25):.0f}–{chads2_neg.quantile(0.75):.0f})',
        '—',
        f'{p_chads2:.3f}'
    ])
    
    chadsvasc_pos = df[df['LAA clot'] == 1]['CHADS2-VASC'].dropna()
    chadsvasc_neg = df[df['LAA clot'] == 0]['CHADS2-VASC'].dropna()
    _, p_chadsvasc = stats.mannwhitneyu(chadsvasc_pos, chadsvasc_neg)
    table1_data.append([
        'CHA2DS2-VASc, median (IQR)',
        f'{chadsvasc_pos.median():.0f} ({chadsvasc_pos.quantile(0.25):.0f}–{chadsvasc_pos.quantile(0.75):.0f})',
        f'{chadsvasc_neg.median():.0f} ({chadsvasc_neg.quantile(0.25):.0f}–{chadsvasc_neg.quantile(0.75):.0f})',
        '—',
        f'{p_chadsvasc:.3f}'
    ])
    
    print(tabulate(table1_data, headers=headers, tablefmt='grid'))
    
    # Save to file
    with open(f'{output_dir}/table1_baseline_characteristics.txt', 'w') as f:
        f.write("TABLE 1: Baseline Characteristics and Univariate Analysis\n")
        f.write("="*100 + "\n\n")
        f.write(tabulate(table1_data, headers=headers, tablefmt='grid'))
    
    print(f"\n✅ Table 1 saved: {output_dir}/table1_baseline_characteristics.txt")
    
    # Table 2: Multivariable Logistic Regression
    print("\n📊 TABLE 2: Multivariable Logistic Regression Analysis")
    print("-" * 80)
    
    table2_data = []
    headers2 = ['Variable', 'Adjusted OR', '95% CI', 'P-value']
    
    for _, row in lr_coef_df.iloc[1:].iterrows():
        sig = '***' if row['P_value'] < 0.001 else '**' if row['P_value'] < 0.01 else '*' if row['P_value'] < 0.05 else ''
        table2_data.append([
            row['Variable'],
            f'{row["OR"]:.2f}',
            f'{row["CI_Lower"]:.2f}–{row["CI_Upper"]:.2f}',
            f'{row["P_value"]:.3f}{sig}'
        ])
    
    print(tabulate(table2_data, headers=headers2, tablefmt='grid'))
    
    with open(f'{output_dir}/table2_multivariable_regression.txt', 'w') as f:
        f.write("TABLE 2: Multivariable Logistic Regression Analysis\n")
        f.write("="*80 + "\n\n")
        f.write(tabulate(table2_data, headers=headers2, tablefmt='grid'))
        f.write("\n\n")
        f.write("Significance levels: * p<0.05, ** p<0.01, *** p<0.001\n")
    
    print(f"\n✅ Table 2 saved: {output_dir}/table2_multivariable_regression.txt")

def main():
    """Main analysis pipeline"""
    filepath = "/home/abdullahalalawi/Downloads/Final Data TEE and LAA canada.xlsx"
    output_dir = "/home/abdullahalalawi/medical-research-assistant/tee_analysis_output"
    
    print("\n" + "="*80)
    print("🔬 ADVANCED TEE AND LAA STATISTICAL ANALYSIS")
    print("="*80)
    print(f"Dataset: {filepath}")
    print(f"Output Directory: {output_dir}")
    
    # Load data
    df = load_and_clean_data(filepath)
    print(f"\n✅ Loaded {len(df)} records")
    
    # 1. Create Visualizations
    create_visualizations(df, output_dir)
    
    # 2. Calculate Odds Ratios
    or_df = calculate_odds_ratios(df)
    
    # 3. Logistic Regression
    lr_coef_df, lr_result = logistic_regression_analysis(df, output_dir)
    
    # 4. Generate Publication Tables
    generate_publication_table(df, or_df, lr_coef_df, output_dir)
    
    print("\n" + "="*80)
    print("✅ ANALYSIS COMPLETE!")
    print("="*80)
    print(f"\n📁 All outputs saved to: {output_dir}/")
    print("\n📊 Generated Files:")
    print("   • figure1_overview.png - Overview visualizations")
    print("   • figure2_stroke_risk.png - CHA2DS2-VASc analysis")
    print("   • figure3_roc_curve.png - ROC curve for logistic regression")
    print("   • table1_baseline_characteristics.txt - Publication-ready Table 1")
    print("   • table2_multivariable_regression.txt - Publication-ready Table 2")
    
    print("\n🎯 KEY FINDINGS:")
    print("   • Comprehensive visualizations created")
    print("   • Odds ratios with 95% CI calculated")
    print("   • Multivariable logistic regression performed")
    print("   • Publication-ready tables generated")

if __name__ == "__main__":
    main()
