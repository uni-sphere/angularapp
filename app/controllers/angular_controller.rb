class AngularController < ApplicationController
  
  skip_before_action :authenticate_client, only: :index
  skip_before_action :authenticate_organization, only: :index
  skip_before_action :datas?, only: :index
  skip_before_action :read_datas, only: :index
  skip_before_action :admin_rights?, only: :index
  skip_before_action :superadmin_rights?, only: :index
  
  def index
    # render nothing: true
    # render layout: layout_name
    # render json: {name: 'crotte'}.to_json
  end

  # droite
  
  def documents
    render json: 
    {
      id: 0,
      items: [{
        id: 2,
        title: "Matrice",
        items: [{
          id: 21,
          title: "Produit matricielle",
          items: [{
            id: 211,
            title: "Cours",
            items: [{
              id: 2111,
              title: "produit simple",
              document: true,
              items: []
            }, 
            {
              id: 2112,
              title: "produit combiné",
              document: true,
              items: []
            }],
          }, 
          {
            id: 212,
            title: "TD",
            items: []
          }],
        }, 
        {
          id: 22,
          title: "Determinant",
          items: [{
            id: 221,
            title: "Cours",
            items: []
          }, 
          {
            id: 222,
            title: "TD",
            items: []
          }],
        }],
      }, 
      {
        id: 3,
        title: "Algèbre",
        items: []
      }, 
      {
        id: 4,
        title: "Aritmétique",
        items: []
      }
    ]}.to_json
  end

  def create
    logger.info params.inspect
  end 

  # gauche
  def nodes
    render json:
    {
      name: "Lycée Freppel",
      num: 0,
      children: [
        { name: "2 nd",
          num: 1,
          children: [
            { name: "1",
              num: 2},
            { name: 1,
              num: 3},
            { name: "3",
              num: 4}
          ]
        },
        {
          name: "1 ère",
          num: 5,
          children: [
            { name: "S",
              num: 6,
              children:
              [
                { name: "1",
                  num: 7,
                  children: 
                  [
                    { name: "Math",
                      num: 8},
                    { name: "Physic",
                     num: 9}
                  ]
                },
                { name: "2",
                  num: 10}
              ]
            },
            { name: "ES",
              num: 11},
            { name: "L",
              num: 12}
          ]
        },
        {
          name: "Terminal",
          num: 13
        }
      ]
    }.to_json
  end


  private

  def layout_name
    if params[:layout] == 0
      false
    else
      'application'
    end
  end
end