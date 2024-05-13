<script lang="ts">
  export let initials;
  export let size = "w-12";
</script>

<div class="avatar placeholder">
  <div class={`bg-neutral text-neutral-content rounded-full ${size}`}>
    <span>{initials}</span>
  </div>
</div>
