import axios from 'axios'

const http = ({
                  url,
                  params,
                  headers,
                  method
              }) => {
    return new Promise( (resolve,reject) => {
        axios({
            url,
            params,
            headers,
            method
        }).then ( res => {
            resolve( res )
        } ).catch(  error => console.log( error ))

    })
}


export default http
