import AuthCardContent from "./authcardcontent"
import HighlightOff from '@material-ui/icons/HighlightOff';

const Card = (props) => {
    return (
        <>
        <div className="fixed inset-0 transition-opacity">
            <div onClick={props.function} className="absolute inset-0 bg-gray-700 opacity-75"></div>
        </div>

        <div class="fixed mr-2 rounded-xl top-0 sm:mt-10 w-5/12 h-auto bg-white justify-center right-0 z-10">
            <div className="flex justify-end">
                <button onClick={props.function} className="focus:outline-none p-2">
                    <HighlightOff/>
                </button>
            </div>
            <AuthCardContent/>
        </div>
        </>
    )
    }
export default Card;
/*
                    <div class="px-4 bg-blue-200 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                Deactivate account
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm leading-5 text-gray-500">
                                        Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-green-500 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                        <button type="button" class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                            Deactivate
                        </button>
                        </span>
                        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                        <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                            Cancel
                        </button>
                        </span>
                    </div>
*/