import text from './assets/json/text.json';

function UsersCard({ user }) {
    return (
        <div>{user.username}</div>
    )
}

export default UsersCard