<script lang="ts">
    export let data;

    import FileInput from "$lib/FileInput.svelte";
    import FileImage from "$lib/FileImage.svelte";
    import { Editor } from "@pixlrlte/pixlr-sdk";

    let currentFiles: { open: boolean, file: File}[] = [];
    let frame: HTMLIFrameElement;
    let editor: Editor;

    function filesChanged(e: Event) {
        const files = (e.target as HTMLInputElement)?.files;

        if (files?.length && files.length > 0) {
            currentFiles = [
                ...currentFiles,
                ...Array.from(files).map(file => ({open: false, file}))
            ]
        }
    }

    async function openFile(file: File, idx: number) {
        if (!editor) {
            editor = await Editor.connect(data.token, frame);
        }

        currentFiles[idx].open = true;

        for await (const newFile of editor.open(file)) {
            currentFiles[idx] = { open: true, file: newFile };
        }

        currentFiles[idx].open = false;
    }
</script>

<section>
    <div>
        <FileInput on:change={filesChanged} />

        <div class="images">
            {#each currentFiles as {open, file}, i}
                {#if open} 
                    <div class="mark-open">
                        <FileImage file={file} />
                    </div>
                {:else}
                    <button on:click={() => openFile(file, i)}>   
                        <FileImage file={file} />            
                    </button>
                {/if}
            {/each}
        </div>
    </div>

    <!-- svelte-ignore a11y-missing-attribute -->
    <iframe 
        src="/iframe/empty"
        bind:this={frame}>
    </iframe>
</section>

<style>
    section {
        display: grid;

        grid-template-columns: 400px 1fr;
        grid-template-rows: 1fr;
        gap: 10px;

        height: 100%;
    }

    iframe {
        width: 100%;
        height: 100%;
        border: 2px solid var(--tiffany-blue);
    }

    button {
        cursor: pointer;
    }

    .images {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 150px;   
        gap: 5px;
    }

    .mark-open {
        filter: saturate(0);
    }
</style>
