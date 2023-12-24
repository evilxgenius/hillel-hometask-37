// - Використовуючи API https://jsonplaceholder.typicode.com/ зробити пошук поста за ід.
// - Ід має бути введений в інпут (валідація: ід від 1 до 100) Якщо знайдено пост, то вивести на сторінку блок з постом
//   і зробити кнопку для отримання комкоментарів до посту.
// - Зробити завдання використовуючи проміси, перехопити помилки.

// /posts	 100 posts
// /comments 500 comments
// /albums	 100 albums
// /photos	 5000 photos
// /todos	 200 todos
// /users	 10 users

const entryPoint = 'https://jsonplaceholder.typicode.com';

function getPostHandler(e) {
    if (e.key !== 'Enter' ) return;

    const input = e.target;
    const inputValue = +e.target.value;

    if (isNaN(inputValue) || inputValue < 1 || inputValue > 100) {
        alert('Please put a number between 1 and 100 (include 1 and 100)!');
        input.value = '';
        return;
    }

    input.disabled = true;

    fetch(`${entryPoint}/posts/${inputValue}`)
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .then(json => {
            const post = document.querySelector('#post');
            const postTitle = post.querySelector('#post .title p');
            const postBody = post.querySelector('#post .body p');
            const postControl = post.querySelector('#post .control');
            const postComments = post.querySelector('#post .comments');
            const commentsBtn = document.createElement('button');

            postComments.innerHTML = '';
            postControl.innerHTML = '';

            postTitle.textContent = json['title'];
            postBody.textContent = json['body'];

            commentsBtn.textContent = 'Get Comments';
            commentsBtn.dataset.point = `/post/${json['id']}/comments`

            commentsBtn.addEventListener('click', () => {
                input.disabled = true;
                commentsBtn.disabled = true;

                fetch(`${entryPoint}${commentsBtn.dataset.point}`)
                    .then(r => r.ok ? r.json() : Promise.reject(r))
                    .then(json => {
                        postComments.innerHTML = '';

                        json.forEach(comment => {
                            const li = document.createElement('li');
                            const commentName = document.createElement('div');
                            const commentEmail = document.createElement('div');
                            const commentBody = document.createElement('div');

                            commentName.textContent = 'Name: ' + comment['name'];
                            commentEmail.textContent = 'Email: ' + comment['email'];
                            commentBody.textContent = 'Body: ' + comment['body'];

                            li.append(commentName, commentEmail, commentBody);
                            postComments.appendChild(li);
                        });
                    })
                    .catch(error => alert(`JsonPlaceholder returned Error: ${error.status} ${error.body.length ? `(${error.body})` : ''}`))
                    .finally(() => {
                        input.disabled = false;
                        commentsBtn.disabled = false;
                    });
            });

            postControl.appendChild(commentsBtn)

        })
        .catch(error => alert(`JsonPlaceholder returned Error: ${error.status} ${error.body.length ? `(${error.body})` : ''}`))
        .finally(() => input.disabled = false);
}

document.querySelector('#inputPostId').addEventListener('keypress', getPostHandler);