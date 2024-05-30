<template>
    <div class="flex justify-start p-5 ...">
        <Button @click="navigateTo('/main')" variant="ghost">Search</Button>
        <Button @click="navigateTo('/register')" variant="ghost">Register</Button>
        <Button @click="navigateTo('/main')" variant="ghost">Admin</Button>
        <Button @click="navigateTo('/main')" variant="ghost">Storage finder</Button>
    </div>
    <Card>
        <CardHeader>
            <CardTitle>Data management suite</CardTitle>
            <CardDescription>Welcome to the Deltares data management suite. Entry point for finding and publishing datasets.</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-3 p-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Find data</CardTitle>
                        <CardDescription>Explore the central data catalog using the radiantearth STAC Browser.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button>Search data</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Register data</CardTitle>
                        <CardDescription>Register data for projects, experimental facilities</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button>Register data</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Admin</CardTitle>
                        <CardDescription>Adminstration of catalogues, collections and user permissions</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button>Admin</Button>
                    </CardFooter>
                </Card>

            </div>
        </CardContent>
    </Card>
</template>

<script>
export default {
    name: "main"
}
</script>

<style scoped>

</style>