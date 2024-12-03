async function deletePost(button) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }

    const postId = button.getAttribute('data-post-id');
    
    try {
        const response = await fetch(`/edit/delete/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        // Remove the post card from the UI
        const postCard = button.closest('.post');
        postCard.style.opacity = '0';
        postCard.style.transform = 'scale(0.9)';
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            postCard.remove();
        }, 300);

    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
    }
}

async function reviewPost(postId, action) {
    if (!confirm(`Are you sure you want to ${action} this post?`)) {
        return;
    }

    try {
        const response = await fetch(`/edit/review/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });

        if (!response.ok) {
            throw new Error(`Failed to ${action} post`);
        }

        // Remove the post card from the UI with animation
        const postCard = document.querySelector(`.post[data-post-id="${postId}"]`);
        postCard.style.opacity = '0';
        postCard.style.transform = 'scale(0.9)';
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            postCard.remove();
            
            // If approved, we could optionally refresh the page to show in published section
            if (action === 'approve') {
                window.location.reload();
            }
        }, 300);

    } catch (error) {
        console.error(`Error ${action}ing post:`, error);
        alert(`Failed to ${action} post. Please try again.`);
    }
}
