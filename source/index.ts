// builtin
import { mkdir as _mkdir, MakeDirectoryOptions } from 'fs'
import { dirname as _dirname } from 'path'
import { versions } from 'process'
const nodeVersion = String(versions.node || '0')

// external
import { isAccessible } from '@bevry/fs-accessible'
import Errlop from 'errlop'
import versionCompare from 'version-compare'

/** Create a directory. */
export default async function mkdirp(
	path: string | Array<string>,
	opts: MakeDirectoryOptions = {}
): Promise<void> {
	if (Array.isArray(path)) {
		return Promise.all(path.map((i) => mkdirp(i, opts))).then(() => {})
	}

	// if we already exist, nothing to do
	if (await isAccessible(path)) {
		return
	}

	// create according to node.js version
	if (versionCompare(nodeVersion, '14.14.0') >= 0) {
		return new Promise(function (resolve, reject) {
			_mkdir(
				path,
				Object.assign(
					{
						recursive: true,
					},
					opts
				),
				function (err) {
					if (err) {
						if (err.code === 'EEXIST') {
							// something else created it before we could create it
							return resolve()
						}
						return reject(
							new Errlop(`failed to make the directory: ${path}`, err)
						)
					}
					resolve()
				}
			)
		})
	} else {
		const dir = _dirname(path)
		await mkdirp(dir, opts)
		return new Promise(function (resolve, reject) {
			_mkdir(path, Object.assign({}, opts), function (err) {
				if (err) {
					if (err.code === 'EEXIST') {
						// something else created it before we could create it
						return resolve()
					}
					return reject(
						new Errlop(`failed to make the directory: ${path}`, err)
					)
				}
				resolve()
			})
		})
	}
}
