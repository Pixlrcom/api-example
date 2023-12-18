<script lang="ts">
    import '../../app.css';
    import { page } from '$app/stores';

    $: path = $page.url.pathname;
</script>

<div id="grid">
    <a href="/embedded" class="tab left" class:active={path === '/embedded'}>
        Embedded
    </a>

    <a href="/http" class="tab right" class:active={path === '/http'}>
        HTTP
    </a>

    <div id="content">
        <slot />
    </div>
</div>

<style>
    #grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 70px 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px; 

        grid-template-areas: 
            "tab1 tab2"
            "content content";

        min-height: 100%;
        background-color: var(--alice-blue);
    }

    .tab { 
        font-family: monospace;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tab:not(.active) {
        background-color: var(--caribbean-current);
        border-bottom: 1px solid white;
        color: var(--alice-blue);
    }

    .tab.left:not(.active) {
        border-right: 1px solid white;
        box-shadow: -5px -5px 0px rgba(0,0,0,0.10) inset;
    }

    .tab.right:not(.active) {
        border-left: 1px solid white;
        box-shadow: 5px -5px 0px rgba(0,0,0,0.10) inset;
    }

    #content {
        grid-area: content;
        padding: 20px;
    }
</style>
