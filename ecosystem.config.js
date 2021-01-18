module.exports = {
	apps: [{
		name: 'schefs',
		max_restarts: 5,
		script: 'npm run build && echo "done building"  && npm run start'
	}]
}

