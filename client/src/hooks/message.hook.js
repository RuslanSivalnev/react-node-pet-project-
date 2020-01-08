import {useCallback} from 'react'

export const useMessage = () => {
	return useCallback(text => {
		if(text && window.M.toast){
			window.M.toast({html: text})
		}

	},[])

}
