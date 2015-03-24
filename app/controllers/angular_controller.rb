class AngularController < ApplicationController

  def index
    # render layout: layout_name
  end

  
  def documents
    render json: 
    {
      name: "Algèbre",
      num: 0,
      children:[
        { name: "Cours",
          num: 1,
          children:[
            { name: "bonjour",
              num: 2},
            { name: "plop",
              num: 3}
          ]
        },
        { name: "TD",
          num: 4,
          children:[
            { name: "2",
              num: 5},
            { name: "fsd",
              num: 6}
          ]
        }
      ]
    }.to_json
  end

  def create
    logger.info params.inspect
  end 


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