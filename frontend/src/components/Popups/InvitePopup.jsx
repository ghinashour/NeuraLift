import React, { useState, useEffect } from "react";
import "../../styles/Popup.css";

function InvitePopup({ onClose, groupId, groupName }) {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate invite link when component mounts
  useEffect(() => {
    generateInviteLink();
  }, []);

  const generateInviteLink = async () => {
    try {
      // If we have a groupId, generate a specific group invite
      if (groupId) {
        // You can create an API endpoint to generate invite tokens
        const token = btoa(`${groupId}:${Date.now()}`); // Simple base64 encoding
        const link = `${window.location.origin}/join/${groupId}?token=${token}`;
        setInviteLink(link);
      } else {
        // General collaboration invite
        const link = `${window.location.origin}/join`;
        setInviteLink(link);
      }
    } catch (error) {
      console.error("Error generating invite link:", error);
      // Fallback link
      setInviteLink(`${window.location.origin}/join`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${groupName || 'my collaboration group'}`,
          text: `Come join ${groupName || 'our collaboration group'} on Neuralift!`,
          url: inviteLink,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy if Web Share API not supported
      copyToClipboard();
    }
  };

  const shareOnSocialMedia = (platform) => {
    const text = encodeURIComponent(`Join ${groupName || 'my collaboration group'} on Neuralift!`);
    const url = encodeURIComponent(inviteLink);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=Join ${groupName || 'My Collaboration Group'}&body=${text}%0A%0A${url}`
    };

    if (platform === 'email') {
      window.location.href = shareUrls.email;
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="popup-overlay">
        <div className="popup">
          <h2>Generating Invite Link...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup invite-popup">
        <div className="popup-header">
          <h2>Invite to {groupName || 'Collaborate'}</h2>
          <p>Share this link with others to join {groupName ? 'the group' : 'the collaboration'}!</p>
          <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="popup-body">
          <div className="invite-link-section">
            <label>Invitation Link:</label>
            <div className="link-input-container">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="invite-link-input"
              />
              <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={copyToClipboard}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>

          <div className="share-options">
            <h4>Share via:</h4>
            <div className="share-buttons">
              {navigator.share && (
                <button
                  className="invite-popup-share-btn native-share"
                  onClick={shareViaNative}
                >
                  📱 Share
                </button>
              )}
              <button
                className="invite-popup-share-btn whatsapp"
                onClick={() => shareOnSocialMedia('whatsapp')}
              >
                💬 WhatsApp
              </button>
              <button
                className="invite-popup-share-btn telegram"
                onClick={() => shareOnSocialMedia('telegram')}
              >
                ✈️ Telegram
              </button>
              <button
                className="invite-popup-share-btn twitter"
                onClick={() => shareOnSocialMedia('twitter')}
              >
                🐦 Twitter
              </button>
              <button
                className="invite-popup-share-btn linkedin"
                onClick={() => shareOnSocialMedia('linkedin')}
              >
                💼 LinkedIn
              </button>
              <button
                className="invite-popup-share-btn email"
                onClick={() => shareOnSocialMedia('email')}
              >
                📧 Email
              </button>
            </div>
          </div>

          <div className="invite-footer">
            <p className="invite-note">
              This link will expire in 7 days. People with this link can join {groupName ? 'this group' : 'the collaboration'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitePopup;