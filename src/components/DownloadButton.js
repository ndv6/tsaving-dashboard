function getDownloadButton(setList) {
    axios({
        method: "GET",
        url: "http://localhost:8000/v2/transactions"
    }).then((res) => {
        
        setList(res.data.data)

    }).catch((err) => {

    }).finally(() => {
    })
}

export default function DownloadButton() {
    const { size } = 'large';

    React.useEffect(() => {
        getDownloadButton(setList);
    }, [])

    const [list, setList] = useState([]);

    return (
        <div>
            <Button type="primary" shape="round" icon={<DownloadOutlined />} size={size}>
                <CSVLink data={list} style={{ textDecoration: "none", color: "white" }} >
                    &nbsp;Download
                </CSVLink>
            </Button>
        </div >
    )

}

