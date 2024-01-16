//= Init ui
let inputSelectors = [
    'inference_type',
    'model_name',
    'vae_name',
    'prompt',
    'negative_prompt',
    'seed',
    'steps',
    'cfg_scale',
    'sampler_name',
    'denoising_strength',
    'enable_hr',
    'hr_scale',
    'hr_upscaler',
    'hr_second_pass_steps',
    'module',
    'model',
    'weight'
  ];

const intArr = ['seed', 'steps', 'cfg_scale', 'denoising_strength', 'hr_scale', 'hr_second_pass_steps', 'weight'];
const values = {
  inference_type: "txt2img",
  model_name: "realcartoonPixar_v2.safetensors",
  vae_name: "color101VAE_v1.safetensors",
  payload: {
    prompt: "Flower, blue, <gender>",
    negative_prompt: "ugly, low resolution, disfigured, low quality, blurry, blur, nsfw, text, watermark, extra eye brew, poorly drawn face, bad, face, fused face, loned face, worst face, extra face, multiple faces, displaces face, poorly drawn dress.",
    seed: 1590328071,
    steps: 20,
    cfg_scale: 7.5,
    sampler_name: "Euler a",
    denoising_strength: 0.7,
    enable_hr: false,
    hr_scale: 1.2,
    hr_upscaler: "Latent (nearest-exact)",
    hr_second_pass_steps: 15,
    alwayson_scripts: {
      controlnet: {
        args: [
          {
            module: "lineart_standard",
            model: "control_v11p_sd15_lineart",
            weight: 0.75
          }
        ]
      }
    }
  }
};


let payloadArr = ['prompt', 'negative_prompt','seed', 'steps', 'cfg_scale','sampler_name', 'denoising_strength', 'enable_hr', 'hr_scale', 'hr_upscaler', 'hr_second_pass_steps','module', 'model', 'weight']
let controlnetArr = ['module', 'model', 'weight'];

//= Image segment ui
let inputImage;
let previewImage = document.getElementById('previewImage');
let fileInput = document.getElementById('images');

fileInput.onchange = evt => {
  const [file] = fileInput.files;
  if (file) {
    previewImage.src = URL.createObjectURL(file);
    inputImage=file;
  }
}

function handleInputChange(event) {
  let { name, value , type, checked} = event.target;
  if(intArr.includes(event.target.name)) {
      value = Number(event.target.value);
  }

  if(payloadArr.includes(event.target.name)) {
      if(controlnetArr.includes(event.target.name)) {
          values.payload.alwayson_scripts.controlnet.args[0][name] = value;
      }
      values.payload[name] = type === 'checkbox' ? checked : value;
  } else {
      values[name] = value;
  }
};
  
inputSelectors.forEach((selector) => {
  const element = document.getElementById(selector);
  element.addEventListener('change', handleInputChange);
});
  
let submitForm = document.getElementById('submitForm');

submitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Submitted values:', values);

  const jsonString = JSON.stringify(values, null, 2); // The third argument (2) specifies the number of spaces for indentation.
  const blob = new Blob([jsonString], { type: 'application/json' });

  const formData = new FormData();
  formData.append('json', blob, 'sample.json');
  console.log(inputImage);
  formData.append('image', inputImage);

  // fetch('http://localhost:5005/', {
  //   method: 'POST',
  //   body: formData
  // })
  // .then(response => response.text())
  // .then(data => {
  //   alert(data);
  // })
  // .catch(error => {
  //   console.error('Error:', error);
  // });
});




