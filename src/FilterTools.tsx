// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

import { InputGroup, checkIcon } from '@jupyterlab/ui-components';

import React from 'react';
//import { filter } from '@lumino/algorithm';

interface IFilterSnippetProps {
  languages: string[];
  tags: string[];
  onFilter: (
    searchValue: string,
    filterTags: string[],
    languageTags: string[]
  ) => void;
}

interface IFilterSnippetState {
  show: boolean;
  selectedTags: string[];
  searchValue: string;
}

const FILTER_ARROW_UP = 'jp-codeSnippet-filter-arrow-up';
const FILTER_OPTION = 'jp-codeSnippet-filter-option';
const FILTER_TAGS = 'jp-codeSnippet-filter-tags';
const FILTER_TAG = 'jp-codeSnippet-filter-tag';
const FILTER_CHECK = 'jp-codeSnippet-filter-check';
const FILTER_TITLE = 'jp-codeSnippet-filter-title';
const FILTER_TOOLS = 'jp-codeSnippet-filterTools';
const FILTER_SEARCHBAR = 'jp-codeSnippet-searchbar';
const FILTER_SEARCHWRAPPER = 'jp-codeSnippet-searchwrapper';
const FILTER_CLASS = 'jp-codeSnippet-filter';
const FILTER_BUTTON = 'jp-codeSnippet-filter-btn';

export class FilterTools extends React.Component<
  IFilterSnippetProps,
  IFilterSnippetState
> {
  constructor(props: IFilterSnippetProps) {
    super(props);
    this.state = { show: false, selectedTags: [], searchValue: '' };
    this.createFilterBox = this.createFilterBox.bind(this);
    this.renderFilterOption = this.renderFilterOption.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.renderAppliedTag = this.renderAppliedTag.bind(this);
    this.renderUnappliedTag = this.renderUnappliedTag.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.filterSnippets = this.filterSnippets.bind(this);
  }

  componentDidMount(): void {
    this.setState({
      show: false,
      selectedTags: [],
      searchValue: '',
    });
  }

  componentDidUpdate(prevProps: IFilterSnippetProps): void {
    if (prevProps !== this.props) {
      this.setState((state) => ({
        selectedTags: state.selectedTags
          .filter((tag) => this.props.tags.includes(tag))
          .sort(),
      }));
    }
  }

  createFilterBox(): void {
    const filterArrow = document.querySelector(`.${FILTER_ARROW_UP}`);

    const filterOption = document.querySelector(`.${FILTER_OPTION}`);

    filterArrow.classList.toggle('idle');
    filterOption.classList.toggle('idle');
  }

  renderTags(tags: string[]): JSX.Element {
    return (
      <div className={FILTER_TAGS}>
        {tags.sort().map((tag: string, index: number) => {
          if (this.state.selectedTags.includes(tag)) {
            return this.renderAppliedTag(tag, index.toString());
          } else {
            return this.renderUnappliedTag(tag, index.toString());
          }
        })}
      </div>
    );
  }

  renderAppliedTag(tag: string, index: string): JSX.Element {
    return (
      <div
        className={`${FILTER_TAG} tag applied-tag`}
        id={'filter' + '-' + tag + '-' + index}
        key={'filter' + '-' + tag + '-' + index}
      >
        <button onClick={this.handleClick}>{tag}</button>
        <checkIcon.react
          className={FILTER_CHECK}
          tag="span"
          elementPosition="center"
          height="18px"
          width="18px"
          marginLeft="5px"
          marginRight="-3px"
        />
      </div>
    );
  }

  renderUnappliedTag(tag: string, index: string): JSX.Element {
    return (
      <div
        className={`${FILTER_TAG} tag unapplied-tag`}
        id={'filter' + '-' + tag + '-' + index}
        key={'filter' + '-' + tag + '-' + index}
      >
        <button onClick={this.handleClick}>{tag}</button>
      </div>
    );
  }

  handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const target = event.target as HTMLElement;
    const clickedTag = target.innerText;
    const parent = target.parentElement;
    console.log('ok');
    this.setState(
      (state) => ({
        selectedTags: this.handleClickHelper(
          parent,
          state.selectedTags,
          clickedTag
        ),
      }),
      this.filterSnippets
    );
  }

  handleClickHelper(
    parent: HTMLElement,
    currentTags: string[],
    clickedTag: string
  ): string[] {
    if (parent.classList.contains('unapplied-tag')) {
      parent.classList.replace('unapplied-tag', 'applied-tag');

      currentTags.splice(-1, 0, clickedTag);
    } else if (parent.classList.contains('applied-tag')) {
      parent.classList.replace('applied-tag', 'unapplied-tag');

      const idx = currentTags.indexOf(clickedTag);
      currentTags.splice(idx, 1);
    }
    console.log(currentTags);
    return currentTags.sort();
  }

  handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchValue: event.target.value }, this.filterSnippets);
  };

  filterSnippets(): void {
    this.props.onFilter(this.state.searchValue, this.state.selectedTags, [
      'Scala'
    ]); // hmmmmm selected Lang tags?
  }

  renderFilterOption(): JSX.Element {
    //make lang tags/cell tags a dropdown
    return (
      <div className={`${FILTER_OPTION} idle`}>
        <div className={FILTER_TITLE}>
          <span>language tags</span>
        </div>
        {this.renderTags(this.props.languages)}
        <div className={FILTER_TITLE}>
          <span>snippet tags</span>
        </div>
        {this.renderTags(
          this.props.tags.filter(tag => !this.props.languages.includes(tag))
        )}
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div className={FILTER_TOOLS}>
        <div className={FILTER_SEARCHBAR}>
          <InputGroup
            className={FILTER_SEARCHWRAPPER}
            type="text"
            placeholder="SEARCH SNIPPETS"
            onChange={this.handleSearch}
            rightIcon="ui-components:search"
            value={this.state.searchValue}
          />
        </div>
        <div className={FILTER_CLASS}>
          <button className={FILTER_BUTTON} onClick={this.createFilterBox}>
            Filter By Tags
          </button>
          <div className={`${FILTER_ARROW_UP} idle`}></div>
          {this.renderFilterOption()}
        </div>
      </div>
    );
  }
}
