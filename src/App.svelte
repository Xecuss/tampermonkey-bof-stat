<script lang="ts">
import RegionTable from "./components/regionTable.svelte";
import type { IPostItem } from "./interface/post.interface";

export let data: IPostItem[] = []
</script>

<main>
    <RegionTable {data} />
</main>

<style>
</style>
