export default function closeModal(modal) {
    modal.current.classList.add("closing");
    setTimeout(() => {
        modal.current.classList.remove("closing");
        modal.current.close();
    }, 300);
}