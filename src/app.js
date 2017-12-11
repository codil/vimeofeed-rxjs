import vimeo from './vimeo-feed'
import Rx from 'rxjs/Rx'

const store$ = Rx.Observable.from(vimeo.data).map(r => {
    return {
        user: {
            name: r.user.name,
            uri: r.user.uri,
            picture: r.user.pictures && r.user.pictures.sizes[2].link || '',
            link: r.user.link,
            likes: r.user.metadata.connections.likes.total
        },
        name: r.name,
        desc: r.description || '',
        link: r.link,
        likes: r.metadata.connections.likes.total,
        comments: r.metadata.connections.comments.total,
        credits: r.metadata.connections.credits.total
    }
})

const init$ = Rx.Observable.of(state => state)

const perPage$ = Rx.Observable.fromEvent(document.querySelectorAll('.per-page button'), 'click')
    .map(e => parseInt(e.target.dataset.n))
    .map(n => state => Object.assign({}, state, { perPage: n, page: 1 }))

const next$ = Rx.Observable.fromEvent(document.querySelector('#next'), 'click')
    .map(e => state => Object.assign({}, state, { page: state.page + 1 }))

const filterDesc$ = Rx.Observable.fromEvent(document.querySelector('.filter-desc input'), 'input')
    .map(e => e.target.value)
    .scan((acc, text) => { return text.length < 3 ? { filter: acc.text !== '' && acc.filter, text: '' } : { filter: true, text } }, { filter: false, text: '' })
    .filter(toFilter => toFilter.filter)
    .pluck('text')
    .map(text => state => Object.assign({}, state, { desc: text, page: 1 }))

const filterByUsersLikes$ = Rx.Observable.fromEvent(document.querySelector('#filter-likes-chk'), 'change')
    .map(e => e.target.checked)
    .map(chk => state => Object.assign({}, state, { filterByUsersLikes: chk, page: 1 }))

const state$ = Rx.Observable
    .merge(init$, perPage$, next$, filterDesc$, filterByUsersLikes$)
    .scan((state, f) => f(state), { perPage: 10, page: 1, desc:'', filterByUsersLikes: false })

state$.subscribe(state => {
    let append = state.page > 1
    let ul = document.querySelector('#videos')
    if (!append) ul.innerHTML = ""
    document.querySelectorAll('.per-page button').forEach(b => {
        b.classList[parseInt(b.dataset.n) === state.perPage ? 'remove' : 'add']('is-outlined')
    })
    store$
        .filter(v => (state.desc ? v.desc.toLowerCase().indexOf(state.desc.toLowerCase()) > -1 : true) && 
            (state.filterByUsersLikes ? v.user.likes > 10 : true))
        .skip((state.page - 1) * state.perPage)
        .take(state.perPage)
        .subscribe(v => {
            let li = 
            `<li class="video">` + 
                '<div class="columns content">' + 
                    '<div class="column is-2">' + 
                        `<a href=${v.user.link}><img src="${v.user.picture}"></a>` +
                    '</div>' + 
                    '<div class="column is-10">' +
                        `<h3><a href="${v.link}">${v.name}</a></h3>` + 
                        `<div style="margin-bottom: 2em">${v.desc}</div>` + 
                        '<nav class="level">' + 
                            `<div class="level-left has-text-centered"><div><p class="heading">Comments</p><p class="title is-4 has-text-grey">${v.comments}</p></div></div>` + 
                            `<div class="level-left has-text-centered"><div><p class="heading">Likes</p><p class="title is-4 has-text-grey">${v.likes}</p></div></div>` + 
                            `<div class="level-left has-text-centered"><div><p class="heading">Credits</p><p class="title is-4 has-text-grey">${v.credits}</p></div></div>` + 
                        '</nav>' +
                    '</div>' + 
                '</div>' + 
            '</li>'
            ul.insertAdjacentHTML('beforeend', li)
        })
})