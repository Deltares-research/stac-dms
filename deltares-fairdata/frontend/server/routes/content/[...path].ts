import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    const path = getRouterParam(event, 'path')

    if (!path) {
        throw createError({
            statusCode: 400,
            message: 'Path is required'
        })
    }

    try {
        // Read file from the content directory
        // In Nuxt, process.cwd() should point to the project root
        const filePath = join(process.cwd(), 'content', path)

        // Check if file exists first
        if (!existsSync(filePath)) {
            console.error(`File not found at: ${filePath}`)
            console.error(`Current working directory: ${process.cwd()}`)
            console.error(`Requested path: ${path}`)
            throw createError({
                statusCode: 404,
                message: `File not found: ${path}`
            })
        }

        const content = await readFile(filePath, 'utf-8')
        return content
    } catch (error) {
        // If it's already a createError, re-throw it
        if (error.statusCode) {
            throw error
        }

        // Otherwise, wrap it
        throw createError({
            statusCode: 404,
            message: `File not found: ${path}`,
            data: error
        })
    }
})
