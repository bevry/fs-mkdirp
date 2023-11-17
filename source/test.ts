// builtin
import { tmpdir } from 'os'
import { join } from 'path'

// external
import { equal, deepEqual } from 'assert-helpers'
import kava from 'kava'
import { isAccessible } from '@bevry/fs-accessible'

// local
import mkdirp from './index.js'

kava.suite('@bevry/fs-mkdirp', function (suite, test) {
	test('works as expected', function (done) {
		Promise.resolve()
			.then(async function () {
				// prepare the paths
				const root = join(tmpdir(), `bevry-fs-mkdirp-${Math.random()}`)
				const dir1 = join(root, 'dir1', 'nested1')
				const dir2 = join(root, 'dir2', 'nested2')

				// make the paths
				await mkdirp([dir1, dir2])
				deepEqual(
					await isAccessible([dir1, dir2]),
					[true, true],
					'creations were as expected'
				)
			})
			.then(() => done())
			.catch((err) => done(err))
		// finally breaks early node support
	})
})
