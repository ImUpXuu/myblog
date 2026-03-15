<script lang="ts">
import { LIGHT_MODE } from "@constants/constants.ts";
import Icon from "@iconify/svelte";

// Always use light mode
const mode = LIGHT_MODE;
</script>

<!-- Light mode only - no switching needed -->
<div class="relative z-50">
    <button aria-label="Light Mode" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90">
        <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
    </button>
</div>
