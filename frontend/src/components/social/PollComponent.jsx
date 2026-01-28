import React, { useState } from 'react';
import { votePoll } from '../../services/socialApi';
import { Check, Loader } from 'lucide-react';
import './PollComponent.css';

const PollComponent = ({ poll, postId }) => {
    const [localPoll, setLocalPoll] = useState(poll);
    const [voting, setVoting] = useState(false);

    const totalVotes = localPoll.total_votes ||
        localPoll.options.reduce((acc, opt) => acc + opt.votes_count, 0);

    const handleVote = async (optionId) => {
        if (localPoll.user_voted_option || voting) return;

        setVoting(true);
        try {
            await votePoll(postId, optionId);

            // Optimistic update
            const updatedOptions = localPoll.options.map(opt => {
                if (opt.id === optionId) {
                    return { ...opt, votes_count: opt.votes_count + 1, is_voted: true };
                }
                return opt;
            });

            setLocalPoll({
                ...localPoll,
                options: updatedOptions,
                total_votes: totalVotes + 1,
                user_voted_option: optionId
            });
        } catch (error) {
            console.error("Vote failed", error);
        } finally {
            setVoting(false);
        }
    };

    return (
        <div className="poll-container">
            <h4 className="poll-question">{localPoll.question}</h4>
            <div className="poll-options">
                {localPoll.options.map(option => {
                    const percentage = totalVotes > 0
                        ? Math.round((option.votes_count / totalVotes) * 100)
                        : 0;
                    const isSelected = localPoll.user_voted_option === option.id;

                    return (
                        <div
                            key={option.id}
                            className={`poll-option ${localPoll.user_voted_option ? 'voted' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleVote(option.id)}
                        >
                            <div className="poll-progress" style={{ width: `${percentage}%` }}></div>
                            <div className="poll-content">
                                <span className="poll-text">{option.text}</span>
                                <span className="poll-stats">
                                    {percentage}% {isSelected && <Check size={14} />}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="poll-footer">
                {totalVotes} votes • {localPoll.is_active ? 'Active' : 'Closed'}
            </div>
        </div>
    );
};

export default PollComponent;
