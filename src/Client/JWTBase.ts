export class JWTBase {

    protected transformOptions = async (options: RequestInit): Promise<RequestInit> => {
        let token = this.applyLocalstorageToken(); // your custom logic to get the token

        options.headers = {
            ...options.headers,
            Authorization: 'Bearer ' + token,
        };
        return Promise.resolve(options);
    };

    protected transformResult(url: string, response: Response, processor: (response: Response) => any) {
        if(response.status === 401) {
            if(response.headers.has("x-token-expired")) {
                //token expired
            }
            return response.text().then(t => {
                throw t
            })
        } else {
            return processor(response);
        }
    }

    applyLocalstorageToken = () => {
        return sessionStorage.getItem("userLoginToken")
    }
}