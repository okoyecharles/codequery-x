type Timestamp = {
	createdAt: string;
	updatedAt: string;
}

export type User = {
	_id: string;
	username: string;
	password: string;
	name: string;
};

export type Question = {
	_id: string;
	question: string;
	user: User;
	answers: Answer[];
	intelligentAnswer: string | null;
} & Timestamp; 

export type Answer = {
	_id: string;
	answer: string;
	user: User;
	question: string;
	upvotes: string[];
	downvotes: string[];
} & Timestamp;
