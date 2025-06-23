import { useState } from "react";
import { fetchGitHubUserDetails } from "../../hooks/getUsers";
import { Dialog } from "../../components/Dialog";

interface userDetails {
    login: string;
    name?: string;
    company?: string;
    blog?: string;
    bio?: string;
}

export const UserModal: React.FC<{ login: string }> = ({ login }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<userDetails | null>(null);
    const [loading, setLoading] = useState(false);

    const openDialog = async () => {
        setLoading(true);
        try {
            const details = await fetchGitHubUserDetails(login);
            setUserDetails(details);
            setDialogOpen(true);
        } catch (error) {
            console.error("Error fetching user details:", error);
            alert('Failed to load user details.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleConfirm = () => {
        alert('Confirmed!');
        setDialogOpen(false);
    };

    return (
        <>
            <button onClick={openDialog} disabled={loading} className="button">
                {loading ? 'Loading...' : 'Read More'}
            </button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={`Details for ${userDetails?.login || login}`}
                confirmLabel=""
                cancelLabel=""
            >
                {userDetails ? (
                    <div className="user-modal-card">
                        <p><strong>Name:</strong> {userDetails.name || 'N/A'}</p>
                        <p><strong>Company:</strong> {userDetails.company || 'N/A'}</p>
                        <p><strong>Blog:</strong> {userDetails.blog ? <a href={userDetails.blog} target="_blank" rel="noreferrer">{userDetails.blog}</a> : 'N/A'}</p>
                        <p><strong>Bio:</strong> {userDetails.bio || 'N/A'}</p>
                    </div>
                ) : (
                    <p>No details available.</p>
                )}
            </Dialog>
        </>
    );
};


