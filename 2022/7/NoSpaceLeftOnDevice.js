const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');
const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

/**
 * @param {string} input
 */
const createFileSystemMap = (input) => {
    const commands = input.split('\n');
    const fileSystem = {};

    let cwd = '';

    const matchers = [{
        pattern: '$ cd /',
        action: () => cwd = '/'
    }, {
        pattern: '$ cd',
        action: (command) => { 
            const dirname = command.split(' ').pop();
            cwd = path.join(cwd, dirname)
        }
    }, {
        pattern: 'dir',
        action: () => null
    }, {
        pattern: '$ ls',
        action: () => null
    }, {
        pattern: '',
        action: (command) => {
            const [filesize, filename] = command.split(' ');
            const pathname = path.join(cwd, filename);
            fileSystem[pathname] = parseInt(filesize, 10)
        }
    }];

    commands.forEach((command) => {
        matchers
            .find(({ pattern }) => command.indexOf(pattern) === 0)
            .action(command)   
    });

    return fileSystem
}

const createFolderSizeMap = (fileSystem = {}) => Object
    .entries(fileSystem)
    .reduce((sizeByFolder, [filePath, size]) => {
        let dirname = filePath;

        do {
            dirname = path.dirname(dirname);
            sizeByFolder[dirname] = (sizeByFolder[dirname] || 0) + size;
        } while (dirname !== '/');

        return sizeByFolder;
    }, {});

const MAX_SIZE = 100000;

/**
 * @param {string} input
 */
const totalSizeOfSmallDirectories = (input) => {
    const fileSystem = createFileSystemMap(input);
    const sizeByFolder = createFolderSizeMap(fileSystem);
    return Object.values(sizeByFolder)
        .filter(dirSize => dirSize <= MAX_SIZE)
        .reduce((result, size) => result += size);
}

expect(totalSizeOfSmallDirectories(testData)).to.equal(95437);
expect(totalSizeOfSmallDirectories(taskInput)).to.equal(1989474);

// Part 2

const TOTAL_DISK_SPACE = 70000000;
const NEEDED_DISK_SPACE = 30000000;

/**
 * @param {string} input
 */
const findSmallestToDelete = (input) => {
    const fileSystem = createFileSystemMap(input);
    const sizeByFolder = createFolderSizeMap(fileSystem);
    const currentTotalSize = sizeByFolder['/'];
    const currentUnusedSpace = TOTAL_DISK_SPACE - currentTotalSize;
    const minSizeToClearUp = NEEDED_DISK_SPACE - currentUnusedSpace;    

    return Object.values(sizeByFolder)
        .filter(size => size > minSizeToClearUp)
        .sort((a, b) => a - b)
        .at(0);
}

expect(findSmallestToDelete(testData)).to.equal(24933642)
expect(findSmallestToDelete(taskInput)).to.equal(1111607)

// node 2022/7/NoSpaceLeftOnDevice.js