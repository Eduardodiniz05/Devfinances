const Modal = {
    open(){
        //abrir o modal
        //adicionar a class active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close(){
        //fechar o modal
        //remover a classe active do modal
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    },
}




const Transaction = {
    all: [
        {
        description: 'Luz',
        amount: -50000,
        date: '17/03/2021'
        },
        {
        description: 'Criação web site',
        amount: 500000,
        date: '17/03/2021'},
        {
            description: 'Internet',
            amount: 20000,
            date: '17/03/2021'
        },
        {
            description: 'Compras mensais',
            amount: -50000,
            date: '17/03/2021'
        },
        {
            description: 'Aluguel',
            amount: -100000,
            date: '17/03/2021'
        },
    ],

    add(transaction){

        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)
        
        App.reload()
    },

    incomes(){ 
        let income = 0;
        /* pegar todas as transações
        para cada transação*/
        Transaction.all.forEach(transaction =>{
            
            //se ela for maior que 0
            if (transaction.amount > 0){
                
                //somar uma variavel e retornar a variavel
                income += transaction.amount;
            }
        })

        return income;
    },
    expenses(){
        let expense = 0;
        /* pegar todas as transações
        para cada transação*/
        Transaction.all.forEach(transaction =>{
            
            //se ela for menor que 0
            if(transaction.amount < 0){
            
            
                //somar uma variavel e retornar a variavel
                expense += transaction.amount;
            }
        })

        return expense;
    },
    total(){
        
        return Transaction.incomes() + Transaction.expenses();
    },
}


const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),


    addTransaction(transaction, index){

        const tr= document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },



    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"  

        const  amount = Utils.formatCurrency(transaction.amount)

        const html = `
    
        <td class= "description">${transaction.description}</td>
        <td class= "${CSSclass}">${amount}</td>
        <td class= "date">${transaction.date}</td>
        <td>
             <img onclick = "Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
        </td>
        `

        return html
    },


    updateBalance(){
        document
        .getElementById('incomeDisplay')
        .innerHTML= Utils.formatCurrency(Transaction.incomes())
        document
        .getElementById('expenseDisplay')
        .innerHTML= Utils.formatCurrency(Transaction.expenses())
        document
        .getElementById('totalDisplay')
        .innerHTML= Utils.formatCurrency(Transaction.total())
    },


    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },

    formatDate(date){
        const splittedDate = date.split('-')

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) /100

        value =  value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"


        })

        return (signal + value)

    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValue() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },


    validadeFields() {
        const { description, amount, date } = Form.getValue()
      
        if(
            description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === ""){
                throw new Error("Por favor preencha todos os campos do formulário")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValue()
        
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            //verificar se  todas as informações  foram preenchidas
            Form.validadeFields()
    
            //formatar  os dados para salvar
            const transaction = Form.formatValues()

            //salvar
            Transaction.add(transaction)

            //apagar os dados do formulario
            Form.clearFields()
            
            //modal feche
            Modal.close()

            //atualizar a aplicação
            //ja existe reload no add

        } catch (error) {
            alert(error.message)
        }

    }
}

const Storage = {
    get() {

    },
    set(transactions) {

    }
}


const App = {
    init(){
        
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        

    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}


App.init()
