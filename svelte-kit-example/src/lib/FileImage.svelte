<script lang="ts">
    import { readFile } from "./io";

    export let file: File;
</script>

{#await readFile(file)}
    <div></div>
{:then url}
    <img src={url} alt={file.name} title={file.name}  />
{/await}

<style>
    div {
        background-color: var(--floral-white);
        width: 100%;
        height: 100%;
    }

    img {
        background-color: var(--floral-white);
        width: 100%;
        height: 100%;

        object-fit: contain;
    }
</style>
