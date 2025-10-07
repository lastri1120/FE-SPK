const API = "http://localhost:3000";

document.getElementById("formData").addEventListener("submit", async function(e){
  e.preventDefault();
  const inputs = e.target.querySelectorAll("input");
  
  // Tambah cabang
  let res = await fetch(`${API}/branches`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({name:inputs[0].value, address:"-"})
  });
  let cabang = await res.json();
  
  // Ambil ID terakhir (untuk demo bisa langsung 1,2,3 atau ambil GET)
  const [allBranches] = await (await fetch(`${API}/branches`)).json();
  
  // Tambah evaluasi
  await fetch(`${API}/evaluations`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      branch_id: allBranches.id,
      c1: parseFloat(inputs[1].value),
      c2: parseFloat(inputs[2].value),
      c3: parseFloat(inputs[3].value),
      c4: parseFloat(inputs[4].value)
    })
  });

  alert("Data berhasil ditambahkan!");
  e.target.reset();
});

async function fetchSAW(){
  let res = await fetch(`${API}/saw`);
  let hasil = await res.json();
  const tbody = document.getElementById("hasilTable");
  tbody.innerHTML = hasil.map(d=>`
    <tr>
      <td class="border px-2 py-1">${d.name}</td>
      <td class="border px-2 py-1">${d.c1}</td>
      <td class="border px-2 py-1">${d.c2}</td>
      <td class="border px-2 py-1">${d.c3}</td>
      <td class="border px-2 py-1">${d.c4}</td>
      <td class="border px-2 py-1 font-bold">${d.score.toFixed(3)}</td>
      <td class="border px-2 py-1 text-center">${d.rank}</td>
    </tr>
  `).join("");
}
