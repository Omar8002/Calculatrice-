const { connect, Provider } = ReactRedux;
const { createStore } = Redux;
const {useState, useEffect} = React;


const glassTheme = {
    calculatorBody:'calculator-container calculator-container-glass',
    themeSwitch:"button-glass switch-mode switch-mode-glass",
    clearButton:"button-glass clear-btn-glass",
    equalToButton:"button-glass equals-to equals-to-glass",
    deleteButton:"button-glass delete-glass",
    numberButton:"button-glass number-btn-glass",
    secondaryOperator:"button-glass secondary-operator-glass",
    primaryOperator:"button-glass primary-operator-glass"
}

const darkTheme = {
    calculatorBody:'calculator-container calculator-container-dark',
    themeSwitch:"button-dark switch-mode switch-mode-dark",
    clearButton:"button-dark clear-btn-dark",
    equalToButton:"button-dark equals-to equals-to-dark",
    deleteButton:"button-dark delete-dark",
    numberButton:"button-dark number-btn-dark",
    secondaryOperator:"button-dark secondary-operator-dark",
    primaryOperator:"button-dark primary-operator-dark"
}

const lightTheme = {
    calculatorBody:'calculator-container calculator-container-light',
    themeSwitch:"button-light switch-mode switch-mode-light",
    clearButton:"button-light clear-btn-light",
    equalToButton:"button-light equals-to equals-to-light",
    deleteButton:"button-light delete-light",
    numberButton:"button-light number-btn-light",
    secondaryOperator:"button-light secondary-operator-light",
    primaryOperator:"button-light primary-operator-light"
}

const themes=[lightTheme, darkTheme, glassTheme];


const icons=[<i class="fas fa-sun"></i>,<i class="fas fa-moon"></i>,<i class="fab fa-pagelines"></i>];

const backgrounds=['#E4E7E8','#181818',"url('https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"]


//Components of the calculator...

const History = (props) => {
        let history = props.history;
        return(
            <div className='history'>
            <ul>{history.map(item => <li>{item}</li>)}</ul>
            </div>
        )
}

const Display = (props) => {
  return(
    <div className='display' >
       {props.display}
    </div>
  )
}




const Buttons = (props) =>{
        return(
            <div className='button-section'>
                <button onClick = {() => props.changeTheme()} className={props.theme.themeSwitch} id='mode' value='mode'>{props.icon}</button><h4>Change theme</h4>
                <div className='button-container button-container-glass'>
                    <div className='btn-section-left btn-section-left-light'>
                        <button onClick = {() => props.clear()} className={props.theme.clearButton} id='clear' value="C">C</button>
                        <button onClick = {e => props.primaryOperator(e)} className={props.theme.secondaryOperator} id='open-bracket' value="(">(</button>
                        <button onClick = {e => props.primaryOperator(e)} className={props.theme.secondaryOperator} id='close-bracket' value=")">)</button>
                        <button onClick = {e => props.solve(e)} className={props.theme.secondaryOperator} id='sqrt' value='√'>√</button>
                        <button onClick = {e => props.primaryOperator(e)} className={props.theme.secondaryOperator} id='percent' value='%'>%</button>
                        <button onClick = {(e) => props.primaryOperator(e)} className={props.theme.secondaryOperator} id='modulo' value='mod'>mod</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='seven' value="7">7</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='eight' value="8">8</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='nine' value="9">9</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='four' value="4">4</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='five' value="5">5</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='six' value="6">6</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='one' value="1">1</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='two' value="2">2</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='three' value="3">3</button>
                        <button onClick = {() => props.decimal()} className={props.theme.numberButton} id='decimal' value='.'>.</button>
                        <button onClick = {e => props.number(e)} className={props.theme.numberButton} id='zero' value='0'>0</button>
                        <button onClick = {() => props.delete()} className={props.theme.deleteButton} id='delete' value='⌫'>⌫</button>
                    </div>

                    <div className='btn-section-right'>
                        <button onClick = {e => props.primaryOperator(e)} className={props.theme.primaryOperator} id='multiply' value="x">x</button>
                        <button onClick = {e => props.primaryOperator(e)} className={props.theme.primaryOperator} id='divide' value="/">÷</button>
                        <button onClick = {e => props.primaryOperator(e)} className={props.theme.primaryOperator} id='subtract' value='-'>-</button>
                        <button onClick = {e => props.primaryOperator(e)} className={props.theme.primaryOperator} id='add' value='+'>+</button>
                        <button onClick = {(e) => props.solve(e)} className={props.theme.equalToButton} id='equal-to' value='='>=</button>
                    </div>

                </div>
            </div>
        )
}
//Defining regular expressions to test for the value of buttons

const isOperator = /[x/+‑@]/;
const endsWithOperator = /[x+‑/@]$/;
const endsWithNegativeSign = /\d[x/+‑]{1}‑$/;

var themeTracker = 0;
//The main app with component nested inside
class Calculator extends React.Component{
  constructor(props){
    super(props);
    
    this.state = ({
      icon:icons[themeTracker],
      theme:themes[themeTracker],
      currentVal: '0',
      prevVal: '0',
      formula: '0',
      history:[]
      
    })
    
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
    this.handlePrimaryOperators = this.handlePrimaryOperators.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleSolve = this.handleSolve.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleTheme = this.handleTheme.bind(this);
  };
 
  componentDidUpdate() {
    document.body.style.background = backgrounds[themeTracker];
  }
  
  maxDigitWarning(){
    let currentDisplay = this.state.formula;
     this.setState({
      formula: 'Digit Limit Met'
    });
    setTimeout(() => this.setState({ formula: currentDisplay }), 1000);
  }
  
  handleSolve(e){
    if (!this.state.currentVal.includes('Limit')) {
      let expression = this.state.formula;
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression
        .replace(/%/g, '/100')
        .replace(/mod/g,'%')
        .replace(/x/g, '*')
        .replace(/‑/g, '-')
        .replace('--', '+0+0+0+0+0+0+');
      let answer =  Math.round(1000000000000 * eval(expression)) / 1000000000000;
      let sqrt = (e.target.value == '√')?'√':'';
      if(sqrt == '√'){
        answer = Math.round(Math.sqrt(answer) *1000000000)/1000000000;
      }
      expression = `${sqrt}(${expression
            .replace(/[%]/,'mod')
            .replace(/\/100/g, '%')
            .replace(/\*/g, '⋅')
            .replace(/-/g, '‑')
            .replace('+0+0+0+0+0+0+', '‑-')
            .replace(/(x|\/|\+)‑/, '$1-')
            .replace(/^‑/, '-')}) =
          ${answer}`;
      this.setState({
        currentVal: answer.toString(),
        formula:`=${answer}`,
        prevVal: answer,
        evaluated: true,
        history:[...this.state.history,expression]
      });
    }
  }
  
  handlePrimaryOperators(e){
    if (!this.state.formula.includes('Limit')) {
      const value = e.target.value;
      const { formula, prevVal, evaluated } = this.state;
      this.setState({ currentVal: value, evaluated: false });
      if (evaluated) {
        this.setState({ formula: prevVal + value });
      } else if (!endsWithOperator.test(formula)) {
        this.setState({
          prevVal: formula,
          formula: formula + value
        });
      } else if (!endsWithNegativeSign.test(formula)) {
        this.setState({
          formula:
            (endsWithNegativeSign.test(formula + value) ? formula : prevVal) +
            value
        });
      } else if (value !== '‑') {
        this.setState({
          formula: prevVal + value
        });
      }
    }
  }
 
  handleNumbers(e){
    if (!this.state.formula.includes('Limit')) {
      const { currentVal, formula, evaluated } = this.state;
      const value = e.target.value;
      this.setState({ evaluated: false });
      if (currentVal.length > 15) {
        this.maxDigitWarning();
      } else if (evaluated) {
        this.setState({
          currentVal: value,
          formula: value !== '0' ? value : ''
        });
      } else {
        this.setState({
          currentVal:
            currentVal === '0' || isOperator.test(currentVal)
              ? value
              : currentVal + value,
          formula:
            currentVal === '0' && value === '0'
              ? formula === ''
                ? value
                : formula
              : /([^.0-9]0|^0)$/.test(formula)
              ? formula.slice(0, -1) + value
              : formula + value
        });
      }
    }
  }
  
  handleDecimal() {
    if (this.state.evaluated === true) {
      this.setState({
        currentVal: '0.',
        formula: '0.',
        evaluated: false
      });
    } else if (
      !this.state.currentVal.includes('.') &&
      !this.state.currentVal.includes('Limit')
    ) {
      this.setState({ evaluated: false });
      if (this.state.currentVal.length > 21) {
        this.maxDigitWarning();
      } else if (
        endsWithOperator.test(this.state.formula) ||
        (this.state.currentVal === '0' && this.state.formula === '')
      ) {
        this.setState({
          currentVal: '0.',
          formula: this.state.formula + '0.'
        });
      } else {
        this.setState({
          currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + '.',
          formula: this.state.formula + '.'
        });
      }
    }
  }
  
  handleDelete(){
    let currrentVal= this.state.currentVal;
    let formula = this.state.formula;
    formula = formula.split('');
    formula.pop();
    formula = formula.join('');
    this.setState({
      ...this.state,
      formula:formula
    })
  }

  handleClear(){
    this.setState({
      ...this.state,
      currentVal:'',
      formula:'0',
      prevVal:''
    })
  }
  
  handleTheme(){
    themeTracker = themeTracker <= 1? themeTracker+1 :0;
    this.setState({
      ...this.state,
      theme:themes[themeTracker],
      icon:icons[themeTracker]
    })
  }
  
 
  
  render(){
        return(
            <div className={this.state.theme.calculatorBody}>
                <History history = {this.state.history}/>
                <Display display={this.state.formula}/>
                <Buttons icon= {this.state.icon} solve={this.handleSolve} number={this.handleNumbers} primaryOperator = {this.handlePrimaryOperators} clear = {this.handleClear} theme = {this.state.theme} decimal={this.handleDecimal} delete={this.handleDelete} changeTheme={this.handleTheme}/>
            </div>
        )
    }
}


ReactDOM.render(<Calculator />, document.getElementById('root'));