# Contributing to Medcentric AI

Thank you for your interest in contributing to Medcentric AI! This document provides guidelines for contributing to this educational healthcare AI project.

## 🚨 Important Reminder

Medcentric AI is an **educational prototype** and **NOT** a medical device. All contributions must maintain this ethical boundary and include appropriate disclaimers.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, or identity.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the project and community

**Unacceptable behaviors include:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report:
1. **Check existing issues** to avoid duplicates
2. **Verify the bug** in both development and production environments
3. **Gather information**: Browser version, OS, error logs, screenshots

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Backend URL: [if relevant]
```

---

### 💡 Suggesting Enhancements

**Enhancement Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.
```

---

### 🔧 Code Contributions

We welcome contributions in these areas:

#### Backend (Python/FastAPI)
- Model improvements (better algorithms, hyperparameter tuning)
- API endpoint enhancements
- Performance optimization
- Error handling and validation
- Additional preprocessing techniques

#### Frontend (React/Tailwind)
- UI/UX improvements
- Accessibility enhancements (WCAG compliance)
- Mobile responsiveness
- Data visualization (charts, graphs)
- Internationalization (i18n)

#### Machine Learning
- Feature engineering
- Model explainability (SHAP, LIME)
- Cross-validation improvements
- Handling imbalanced datasets
- External dataset validation

#### Documentation
- README improvements
- API documentation
- Code comments
- Tutorial videos or blog posts

---

## Development Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/medcentric-ai.git
cd medcentric-ai

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run data preprocessing and training
python clean_data.py
python train_model.py

# Start backend server
uvicorn main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Coding Standards

### Python (Backend)

**Style Guide**: Follow [PEP 8](https://peps.python.org/pep-0008/)

**Key Principles:**
- Use 4 spaces for indentation
- Maximum line length: 100 characters
- Use descriptive variable names
- Add docstrings to functions and classes

**Example:**
```python
def calculate_risk_score(patient_data: dict) -> float:
    """
    Calculate cardiovascular risk score from patient vitals.
    
    Args:
        patient_data: Dictionary containing patient clinical data
        
    Returns:
        float: Risk score between 0.0 and 1.0
        
    Raises:
        ValueError: If required fields are missing
    """
    # Implementation here
    pass
```

**Linting:**
```bash
# Install tools
pip install black flake8 pylint

# Format code
black main.py

# Check style
flake8 main.py
pylint main.py
```

---

### JavaScript/React (Frontend)

**Style Guide**: Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

**Key Principles:**
- Use 2 spaces for indentation
- Use functional components and hooks
- Prefer `const` over `let`
- Use meaningful component and variable names

**Example:**
```javascript
/**
 * Renders the risk assessment form.
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @returns {JSX.Element}
 */
export default function RiskAssessmentForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  // Implementation
}
```

**Linting:**
```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(backend): add SHAP explainability to predictions

- Integrate SHAP library for model interpretability
- Add /explain endpoint returning feature importance
- Update API documentation

Closes #42
```

```
fix(frontend): resolve CORS error in production

The API calls were failing due to incorrect CORS headers.
Updated CORSMiddleware configuration in main.py.

Fixes #58
```

---

## Pull Request Process

### Before Submitting

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write clean, tested code**
   - Follow coding standards
   - Add comments where necessary
   - Write or update tests

3. **Update documentation**
   - README.md (if adding features)
   - API docs (if changing endpoints)
   - Code comments

4. **Test thoroughly**
   - Manual testing in dev environment
   - Run existing tests (if available)
   - Test in multiple browsers (frontend changes)

### Submitting the PR

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub**

3. **Fill out the PR template**:
   ```markdown
   ## Description
   Brief description of changes.

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   How was this tested?

   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Tests pass locally
   ```

4. **Wait for review**
   - Respond to feedback promptly
   - Make requested changes
   - Push updates to the same branch

---

## Testing Requirements

### Backend Testing

**Unit Tests** (Future Enhancement):
```python
# tests/test_predict.py
def test_predict_endpoint():
    """Test the /predict endpoint with valid data."""
    # Test implementation
    pass
```

**Manual Testing Checklist**:
- [ ] `/` endpoint returns welcome message
- [ ] `/predict` endpoint accepts valid JSON
- [ ] Model returns predictions with confidence scores
- [ ] CORS headers are present in responses

### Frontend Testing

**Manual Testing Checklist**:
- [ ] All form fields accept and validate input
- [ ] Disclaimer banner is visible on page load
- [ ] Risk assessment displays correct colors (red/green)
- [ ] Download report generates correct .txt file
- [ ] Session history updates after each submission
- [ ] Mobile responsive design works (< 768px width)

**Accessibility Testing**:
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility (use NVDA or JAWS)
- [ ] Color contrast meets WCAG AA standards
- [ ] Form labels are properly associated

---

## Documentation

### Code Comments

**When to comment:**
- Complex algorithms or business logic
- Non-obvious design decisions
- Workarounds for bugs or limitations
- Public API functions

**When NOT to comment:**
- Obvious code (e.g., `// Set age to 25`)
- Outdated information (keep comments up-to-date)

### API Documentation

When adding or modifying endpoints:
1. Update `main.py` docstrings
2. Test in Swagger UI (`/docs`)
3. Update README.md with examples
4. Consider adding request/response examples

---

## Areas We Need Help With

### High Priority
- [ ] **Model Explainability**: Integrate SHAP or LIME
- [ ] **Unit Tests**: Add pytest suite for backend
- [ ] **Cross-Validation**: Implement k-fold CV in training
- [ ] **Mobile UX**: Improve touch interactions

### Medium Priority
- [ ] **Database Integration**: Add PostgreSQL for patient history
- [ ] **User Authentication**: JWT-based auth system
- [ ] **Data Visualization**: Add charts for risk factors
- [ ] **Internationalization**: Support Spanish, French, Mandarin

### Low Priority
- [ ] **Docker Support**: Add Dockerfile and docker-compose
- [ ] **CI/CD Pipeline**: GitHub Actions for automated testing
- [ ] **Performance Monitoring**: Integrate Sentry
- [ ] **A/B Testing**: Compare different ML models

---

## Recognition

Contributors will be:
- Listed in the README.md "Contributors" section
- Acknowledged in release notes
- Credited in academic papers (if applicable)

---

## Questions?

- **Technical Questions**: Open a GitHub Discussion
- **Bug Reports**: Open a GitHub Issue
- **Security Vulnerabilities**: Email maintainer directly (DO NOT open public issue)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make Medcentric AI better! 🚀**

**Remember**: All contributions must maintain the educational/research scope and never promote clinical use of this tool.
