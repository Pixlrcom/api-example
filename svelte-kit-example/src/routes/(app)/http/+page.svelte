<script lang="ts">
    export let form;

    let file: string;
</script>

<section>
    <div>
        <p>Select an image and we will post it to the Pixlr API</p>

        <form method="post" enctype="multipart/form-data" action="?/open">
            <label class="button">
                <input
                    type="file"
                    accept="image/*"
                    name="file"
                    bind:value={file}
                />
                Select file
                {file ?? ""}
            </label>

            <button class="button" disabled={!file}>Open in Pixlr</button>
        </form>
    </div>

    <div class="result">
        {#if form?.fileName}
            <div>
                <img src="/upload/{form.fileName}" alt={form.fileName} />
            </div>
        {:else}
            <p>No image opened yet</p>
        {/if}
    </div>
</section>

<style>
    button {
        margin-top: 15px;
        display: block;
    }

    section {
        display: grid;

        grid-template-columns: 400px 1fr;
        grid-template-rows: 1fr;
        gap: 10px;

        height: 100%;
    }

    input {
        display: none;
    }

    .result {
        border: 2px solid var(--tiffany-blue);
        background-color: #fff;

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
