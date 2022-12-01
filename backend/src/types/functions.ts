
export type Consumer<T> = (entry: T) => void;

export type ErrorHandler = Consumer<any>;

export type Callable = () => void;
