<template>
    <div class="wrapper-content wrapper-content--fixed">
        <section>
            <div class="container">
                <h1 class="title">Page not Found</h1>
                <p>Go to  <router-link class="link" to="/">home page</router-link> </p>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: "404"
    }
</script>

<style scoped lang="scss">
    .wrapper-content{
        min-height: 60vh;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
</style>
