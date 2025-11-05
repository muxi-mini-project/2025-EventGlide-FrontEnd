interface LetterType {
  message: string;
  published_at: string;
  status: string;
  target_bid: string;
  userInfo: {
    avatar: string;
    studentid: string;
    username: string;
  };
}

export default LetterType;
