type AlbumWindowProps = {
    isVisiable: boolean,
    setIsVisiable: (value: boolean) => void,
    setImgUrl: (value: string[]) => void,
    imgUrl: string[],
    isOverlay: boolean,
    type: string,
    count?: number,
    isRequest?: boolean,
}

export default AlbumWindowProps;