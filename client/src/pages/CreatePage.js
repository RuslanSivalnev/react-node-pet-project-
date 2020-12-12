import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../cotext/AuthContext";

export const CreatePage = () => {
	const history = useHistory()
	const auth = useContext(AuthContext)

	const {request} = useHttp()
	const [link, setLink] = useState('')


	const pressHandler = async event => {
		if(event.key === "Enter") {
			try {
				const data = await request('/api/link/generate', 'POST', {among: link}, {
					Authorization: `Bearer ${auth.token}`
				})
				console.log('data', data);
				history.push(`/detail/${data.link._id}`)
			} catch (e) {

			}
		}
	}

	useEffect(() => {
		window.M.updateTextFields()
	}, [])
	return(
		<div className="row">
			<div className="col s8 offset-s" style={{paddingTop: '2rem'}}>
				<div className="input-field">
					<input placeholder="Вставьте ссылку"
								 id="link"
								 type="text"
								 onChange={e => setLink(e.target.value)}
								 onKeyPress={pressHandler}
					/>
					<label htmlFor="link">Введите ссылку</label>
				</div>
			</div>
		</div>
	)

}