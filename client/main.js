// Variables
const socket = io().connect('http://192.168.1.64:3000', {'forceNew': true})
const name = document.querySelector('#name')
let user = document.querySelector(('.user'))
let text = document.querySelector('#newText')
let messages = document.querySelector('#messages')
let username


// Change height's #messages
messages.style.height = `${window.innerHeight - 105}px`


// Detects user
if(usernameLoad()){
    document.querySelector('.welcome').classList.add('hide')
    username = usernameLoad()
    loginUser(username, user)
}else{
    name.addEventListener('keypress', (e) => {
        if(e.key === 'Enter'){
            document.querySelector('.welcome').classList.add('hide')
            username = name.value
            loginUser(username, user)
            usernameSave(username)

        }

    })
}

// Sockets

socket.emit('new-user-login', username)

socket.on('messages', (data) => {
    render(data)
})

socket.on('user', (resp) => {
    newUser(resp)
})


// Event Listeners
text.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        newMessage(username)
        text.value = ''
    }
})




// Functions
function usernameSave(username) {
    localStorage.setItem('username', username)
}

function usernameLoad() {
    return localStorage.getItem('username')
}

function newUser(user){
    const span = document.createElement('span')
    span.innerHTML = `${user} logged in`
    span.classList.add('new-user')
    messages.appendChild(span)
}

function loginUser(username, user){
    const h1 = document.createElement('h1')
    h1.innerHTML = `Welcome <span class="username">${username}</span>❕❗`
    user.appendChild(h1)
}

function newMessage(username) {
    let newMessage = {
        message: document.querySelector('#newText').value,
        from: username
    }
    socket.emit('add-message', newMessage)
}

function render(data){
    let div = document.createElement('div')
    let span = document.createElement('span')
    let p = document.createElement('p')

    div.classList.add('message')
    span.classList.add('name')
    p.classList.add('text')

    let prueba = username === data.from

    if(prueba){
        div.classList.add('me')
        span.innerHTML = `${data.from}`
        p.innerHTML = `${data.message}`

        div.appendChild(p)
        div.appendChild(span)
    }else{
        div.classList.add('you')
        span.innerHTML = `${data.from}`
        p.innerHTML = `${data.message}`

        div.appendChild(span)
        div.appendChild(p)
    }

    messages.appendChild(div)

}