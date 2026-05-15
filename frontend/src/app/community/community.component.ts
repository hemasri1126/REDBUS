import { Component } from '@angular/core';
import { CommunityService } from '../services/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})

export class CommunityComponent {

  constructor(private communityService:CommunityService){}

  hashtags = '';

  editingIndex:number|null = null;

  selectedImage:any='';

  showForm = false;

  title = '';

  description = '';

  route = '';
loading = false;

successMessage = '';

  posts:any[] = [];
ngOnInit(){

  this.getAllPosts();

}
  toggleForm() {
    this.showForm = !this.showForm;
  }
getAllPosts(){

  this.communityService.getPosts()
  .subscribe((data:any)=>{

    this.posts = data;

  });

}
  onFileSelected(event:any){

    const file = event.target.files[0];

    if(file){

      const reader = new FileReader();

      reader.onload = () => {

        this.selectedImage = reader.result;

      };

      reader.readAsDataURL(file);

    }

  }

  createPost(){
    this.loading = true;
    if(!this.isVerifiedUser){

  alert("Only verified users can create posts");

  return;

}

const newPost = {
  title:this.title,
  description:this.description,
  route:this.route,
  hashtags:this.hashtags,
  image:this.selectedImage,
  likes:0,
  comments:[],
  newComment:'',
  reported:false,
 saved:false,
following:false,

};

if(this.editingIndex !== null){

  const postId = this.posts[this.editingIndex]._id;
this.communityService.createPost(newPost)
.subscribe(()=>{

  this.getAllPosts();

  this.loading = false;

  this.successMessage = 'Post Created Successfully ✅';

  setTimeout(()=>{

    this.successMessage = '';

  },3000);

});
  this.editingIndex = null;

}
else{

  this.communityService.createPost(newPost)
.subscribe(()=>{

  this.getAllPosts();

});

}

    this.title='';
    this.description='';
    this.route='';
    this.selectedImage='';

    this.showForm=false;

  }

 likePost(post:any){

  post.likes++;

  this.communityService.updatePost(post._id,post)
  .subscribe();

}addComment(post:any){

  if(post.newComment.trim()!=''){

    post.comments.push(post.newComment);

    post.newComment='';

    this.communityService.updatePost(post._id,post)
    .subscribe();

  }

}
 deletePost(id:any){

  this.communityService.deletePost(id)
  .subscribe(()=>{

    this.getAllPosts();

  });

}
sharePost(post:any){

  const text = `Check out this travel post: ${post.title}`;

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;

  window.open(url,'_blank');

}
reportPost(post:any){

  post.reported = !post.reported;

  this.communityService.updatePost(post._id,post)
  .subscribe();

}
isTrending(post:any){

  return post.likes >= 5;

}
toggleFollow(post:any){

  post.following = !post.following;

  this.communityService.updatePost(post._id,post)
  .subscribe();

}
forums = [
  {
    title:'Hyderabad Routes',
    description:'Discuss bus routes and travel experiences in Hyderabad'
  },
  {
    title:'Travel Tips',
    description:'Share useful travel advice and journey tips'
  },
  {
    title:'Budget Travel',
    description:'Discuss affordable travel options and offers'
  },
  {
    title:'Night Journey',
    description:'Share safety tips and overnight travel experiences'
  }
];
isVerifiedUser = true;
searchText = '';
filteredPosts(){

  return this.posts.filter((post:any)=>

    post.title.toLowerCase().includes(this.searchText.toLowerCase()) ||

    post.route.toLowerCase().includes(this.searchText.toLowerCase()) ||

    post.description.toLowerCase().includes(this.searchText.toLowerCase())

  );

}
getTotalLikes(){

  return this.posts.reduce(
    (total:any,post:any)=> total + post.likes,
    0
  );

}

getTotalComments(){

  return this.posts.reduce(
    (total:any,post:any)=> total + post.comments.length,
    0
  );

}
toggleSave(post:any){

  post.saved = !post.saved;

  this.communityService.updatePost(post._id,post)
  .subscribe();

}

editPost(post:any,index:number){

  this.title = post.title;

  this.description = post.description;

  this.route = post.route;

  this.selectedImage = post.image;

  this.showForm = true;

  this.editingIndex = index;

}
}