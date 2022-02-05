let pagination = document.querySelector('.pagination')
let table = document.createElement("div");
let div = document.createElement("div");
let button = document.querySelector('.btn');
let lastPage;



async function getLastPage() {
    await fetch('https://jordan.ashton.fashion/api/goods/30/comments')
        .then(res => res.json())
        .then(data => lastPage = data.last_page)
}

let userName = document.querySelector('.name');
let sendPost = document.querySelector('.send')
let writeComments = document.querySelector('.write-comments')
let comments = document.querySelector('.comments')
let good = document.querySelector('.good')

async function getComments() {
    await getLastPage()
    return fetch(`https://jordan.ashton.fashion/api/goods/30/comments?page=${lastPage}`).then(res => res.json())
        .then(data => {
            console.log(data)
            createTable(data, comments)
        })
}

async function getPages(url) {
    console.log(url);
    return await fetch(url).then(data => data.json()).then(data => createTable(data, comments))
}



function createTable(data, parent) {
    table.innerHTML = ''
    pagination.innerHTML = ''


    data.data.map(item => {
        let createDiv = document.createElement("div");
        let createImg = document.createElement("img");
        createImg.src = './noava.png'
        createImg.classList.add('userImg');
        createDiv.classList.add('comments-user');
        let date = document.createElement("div");
        date.classList.add('date')
        date.innerHTML = `${item.created_at.slice(0, 19).replace('T', ' ')}`;
        let doubleDiv = document.createElement('div');
        doubleDiv.classList.add('user-comment');
        table.classList.add('wrapper');
        table.prepend(createDiv);
        let createH2 = document.createElement("h2");
        createH2.classList.add('userName');
        createH2.innerText = `${item.name}`
        let createP = document.createElement("p");
        createP.classList.add('comments-text');
        createP.innerText = `${item.text}`
        createDiv.appendChild(createImg)
        doubleDiv.appendChild(createH2)
        doubleDiv.appendChild(createP)
        createDiv.appendChild(doubleDiv)
        createDiv.appendChild(date);
        parent.append(table);

    })

    data.links.map(item => {
        console.log(item);
        let pag = document.createElement('button')
        pag.innerHTML = item.label
        if (item.active == true) {
            pag.style = 'color: red'
        }
        if (item.label == "...") {
            pag.disabled = true
        }

        if (item.label == "&laquo; Previous") {
            pag.innerHTML = "&#8656;"
        }
        if (item.label == "Next &raquo;") {
            pag.innerHTML = "&rArr;"
        }

        if (item.url == null) {
            pag.disabled = true
            pag.style = 'background: gray'

        }

        let url = item.url

        pagination.append(pag)
        pag.addEventListener('click', () => {
            fetch(url).then(data => data.json()).then(adat => console.log(adat, 'sdfsd'))
            getPages(url)

        })
    })

}




async function setComments() {
    await fetch('https://jordan.ashton.fashion/api/goods/30/comments', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            name: userName.value,
            text: writeComments.value,
        })
    }
    ).then(res => {
        if (res.status === 200) {
            good.classList.remove('hidden')
            good.innerText = 'Комментарий успешно добавлен!'
        }
    })
    userName.value = '';
    writeComments.value = '';
    await getComments()
    setTimeout(() => good.classList.add('hidden'), 2500
    )

}

// good.innerText = 'Заполните все поля!'
good.classList.add('hidden')
sendPost.addEventListener('click', () => {

    if (!userName.value || !writeComments.value) {
        good.innerText = 'Заполните все поля!'
        good.classList.remove('hidden')
    } else {
        setComments()
    }
})

userName.oninput = () => {
    good.classList.add('hidden')
}

writeComments.oninput = () => {
    good.classList.add('hidden')
}

window.onload = getComments()




